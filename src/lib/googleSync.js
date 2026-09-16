import { exportFarmData, importFarmData, mergeFarmData, localAuth } from "./localStorageStore.js";

const STORAGE_KEYS = {
  CLIENT_ID: "hortaviva_google_client_id",
  ACCESS_TOKEN: "hortaviva_google_access_token",
  TOKEN_EXPIRES_AT: "hortaviva_google_token_expires_at",
  LAST_SYNC: "hortaviva_google_last_sync",
  DRIVE_FILE_ID: "hortaviva_google_drive_file_id",
  GOOGLE_USER: "hortaviva_google_user_info",
};

const DRIVE_FILE_NAME = "horta_viva_quinta.json";
const SCOPES = [
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
  "openid",
].join(" ");

let tokenClientInstance = null;
let gisScriptLoaded = false;

export const DEFAULT_GOOGLE_CLIENT_ID =
  "112974039146-pndij5p4she2jd23vbqcqknhh2vn65m2.apps.googleusercontent.com";

// Obter o Client ID configurado (via localStorage, env ou ID padrao do projeto)
export function getGoogleClientId() {
  return (
    localStorage.getItem(STORAGE_KEYS.CLIENT_ID) ||
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    DEFAULT_GOOGLE_CLIENT_ID
  );
}

export function setGoogleClientId(clientId) {
  if (!clientId || !clientId.trim()) {
    localStorage.removeItem(STORAGE_KEYS.CLIENT_ID);
  } else {
    localStorage.setItem(STORAGE_KEYS.CLIENT_ID, clientId.trim());
  }
  tokenClientInstance = null;
  notifySyncState();
}

export function isGoogleConfigured() {
  return !!getGoogleClientId();
}

export function getSyncStatus() {
  if (!isGoogleConnected()) return "disconnected";
  if (!hasValidGoogleToken()) return "needs_reconnect";
  return "connected";
}

// O utilizador tem a conta Google ligada se os dados do perfil existirem e nao tiver feito logout
export function isGoogleConnected() {
  return (
    !!localStorage.getItem(STORAGE_KEYS.GOOGLE_USER) &&
    localStorage.getItem("hortaviva_logged_out") !== "true"
  );
}

export function hasValidGoogleToken() {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  const expiresAt = Number(localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRES_AT) || 0);
  return !!token && Date.now() < expiresAt;
}

export function getGoogleUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GOOGLE_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getLastSyncTime() {
  return localStorage.getItem(STORAGE_KEYS.LAST_SYNC) || null;
}

// Carregar dinamicamente a biblioteca Google Identity Services
export function loadGisScript() {
  if (gisScriptLoaded || window.google?.accounts?.oauth2) {
    gisScriptLoaded = true;
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existing) {
      existing.addEventListener("load", () => {
        gisScriptLoaded = true;
        resolve();
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      gisScriptLoaded = true;
      resolve();
    };
    script.onerror = (e) => reject(new Error("Falha ao carregar a biblioteca Google Identity Services"));
    document.head.appendChild(script);
  });
}

function notifySyncState(status = "idle", detail = "") {
  window.dispatchEvent(
    new CustomEvent("hortaviva_sync_change", {
      detail: {
        status,
        detail,
        connected: isGoogleConnected(),
        hasToken: hasValidGoogleToken(),
        syncStatus: getSyncStatus(),
        lastSync: getLastSyncTime(),
        user: getGoogleUser(),
        isConfigured: isGoogleConfigured(),
      },
    })
  );
}

// Iniciar sessão com a conta Google e obter permissão para o Google Drive
export async function connectGoogleDrive(options = {}) {
  const promptMode = options.prompt !== undefined ? options.prompt : "select_account";
  const clientId = getGoogleClientId();
  if (!clientId) {
    throw new Error("ID de Cliente Google não configurado.");
  }

  await loadGisScript();

  return new Promise((resolve, reject) => {
    try {
      tokenClientInstance = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPES,
        error_callback: (err) => {
          notifySyncState("error", err?.message || "Autorização cancelada");
          reject(new Error(err?.message || "Autorização Google cancelada."));
        },
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            notifySyncState("error", tokenResponse.error);
            return reject(new Error(tokenResponse.error_description || tokenResponse.error));
          }

          const accessToken = tokenResponse.access_token;
          const expiresIn = Number(tokenResponse.expires_in || 3600);
          const expiresAt = Date.now() + (expiresIn - 60) * 1000;

          // 1. Limpar explicitamente qualquer flag de logout e salvar tokens
          localStorage.removeItem("hortaviva_logged_out");
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
          localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRES_AT, String(expiresAt));

          const prevGoogleUser = getGoogleUser();

          // 2. Carregar o perfil real a partir do endpoint userinfo da Google
          let profile = null;
          try {
            const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (userRes.ok) {
              profile = await userRes.json();
            }
          } catch (e) {
            console.warn("Não foi possível carregar o perfil Google detalhado:", e);
          }

          const newEmail = (profile?.email || "").toLowerCase().trim();
          const prevEmail = (prevGoogleUser?.email || "").toLowerCase().trim();
          const isAccountSwitch = Boolean(prevEmail && newEmail && prevEmail !== newEmail);

          // Se trocou de conta Google ou ligou uma nova, limpar cache de ficheiro anterior
          if (isAccountSwitch || !prevEmail || prevEmail !== newEmail) {
            localStorage.removeItem(STORAGE_KEYS.DRIVE_FILE_ID);
            localStorage.removeItem(STORAGE_KEYS.LAST_SYNC);
            localStorage.removeItem("hortaviva_monthly_usage_v2");
            localStorage.removeItem("hortaviva_photo_identifications_count");
            localStorage.removeItem("hortaviva_ai_usage_count");
          }

          // 3. Validação estrita da subscrição: NUNCA herdar de outra conta
          try {
            const rawSub = localStorage.getItem("hortaviva_pro_subscription");
            if (rawSub) {
              const sub = JSON.parse(rawSub);
              const subEmail = (sub.google_email || sub.customer_email || "").toLowerCase().trim();
              // A subscrição SÓ permanece se pertencer comprovadamente a esta exata conta Google
              if (!newEmail || !subEmail || subEmail !== newEmail) {
                console.info("[GoogleSync] Subscrição local não pertence a esta conta. Removendo:", subEmail, "vs", newEmail);
                localStorage.removeItem("hortaviva_pro_subscription");
                window.dispatchEvent(new CustomEvent("hortaviva_subscription_changed"));
              }
            }
          } catch (subErr) {
            localStorage.removeItem("hortaviva_pro_subscription");
          }

          let googleUser = {
            id: profile?.sub || profile?.id || (isAccountSwitch ? `google_${Date.now()}` : prevGoogleUser?.id) || `google_${Date.now()}`,
            email: profile?.email || (isAccountSwitch ? "agricultor@gmail.com" : prevGoogleUser?.email) || "agricultor@gmail.com",
            name: profile?.name || (isAccountSwitch ? "Agricultor Google" : prevGoogleUser?.name) || "Agricultor Google",
            full_name: profile?.name || (isAccountSwitch ? "Agricultor Google" : prevGoogleUser?.full_name) || "Agricultor Google",
            picture: profile?.picture || (isAccountSwitch ? "" : prevGoogleUser?.picture) || "",
            avatar_url: profile?.picture || (isAccountSwitch ? "" : prevGoogleUser?.avatar_url) || "",
            avatar_emoji: "🌾",
            auth_provider: "google",
          };

          localStorage.setItem(STORAGE_KEYS.GOOGLE_USER, JSON.stringify(googleUser));
          localAuth.loginWithGoogleUser(googleUser, accessToken);

          notifySyncState("synced", "Ligado com sucesso à conta Google.");
          resolve(accessToken);
        },
      });

      tokenClientInstance.requestAccessToken({ prompt: promptMode });
    } catch (e) {
      notifySyncState("error", e.message);
      reject(e);
    }
  });
}

export function disconnectGoogleDrive() {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  if (token && window.google?.accounts?.oauth2?.revoke) {
    try {
      window.google.accounts.oauth2.revoke(token, () => {});
    } catch {}
  }

  // Desconectar limpa sempre a subscrição deste dispositivo
  localStorage.removeItem("hortaviva_pro_subscription");
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRES_AT);
  localStorage.removeItem(STORAGE_KEYS.GOOGLE_USER);
  localStorage.removeItem(STORAGE_KEYS.DRIVE_FILE_ID);
  localStorage.removeItem(STORAGE_KEYS.LAST_SYNC);
  notifySyncState("idle", "Desconectado do Google Drive");
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("hortaviva_subscription_changed"));
  }
}

export async function getValidAccessToken(interactive = false) {
  if (hasValidGoogleToken()) {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }
  if (!interactive) {
    // O Google pode mostrar o seletor de contas mesmo com prompt vazio. Em segundo
    // plano, mantemos a sessão local e esperamos por uma ação explícita do utilizador.
    const error = new Error("Sessão Google expirada. Liga novamente a conta para sincronizar.");
    notifySyncState("needs_reconnect", "Sessão Google expirada");
    throw error;
  }
  return connectGoogleDrive({ prompt: "select_account" });
}

// Procurar ficheiro existente horta_viva_quinta.json no Google Drive
async function findDriveFile(token) {
  const cachedId = localStorage.getItem(STORAGE_KEYS.DRIVE_FILE_ID);
  if (cachedId) {
    try {
      const checkRes = await fetch(`https://www.googleapis.com/drive/v3/files/${cachedId}?fields=id,name,trashed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (checkRes.ok) {
        const data = await checkRes.json();
        if (!data.trashed) return cachedId;
      }
    } catch {}
  }

  const query = encodeURIComponent(`name='${DRIVE_FILE_NAME}' and trashed=false`);
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&orderBy=modifiedTime desc&fields=files(id,name,modifiedTime)`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Falha ao pesquisar ficheiro no Google Drive.");
  const data = await res.json();
  if (data.files && data.files.length > 0) {
    const fileId = data.files[0].id;
    localStorage.setItem(STORAGE_KEYS.DRIVE_FILE_ID, fileId);
    return fileId;
  }
  return null;
}

// Enviar dados locais para o Google Drive
export async function uploadToGoogleDrive(interactive = false, options = {}) {
  if (!isGoogleConnected()) return { skipped: true };
  notifySyncState("syncing", "A enviar quinta para o Google Drive...");
  try {
    const token = await getValidAccessToken(interactive);
    const existingFileId = await findDriveFile(token);

    let farmData = exportFarmData(options);

    // Se já existe ficheiro remoto, descarrega e funde antes de gravar para nunca perder dados de outro dispositivo
    if (existingFileId) {
      try {
        const remoteRes = await fetch(`https://www.googleapis.com/drive/v3/files/${existingFileId}?alt=media`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (remoteRes.ok) {
          const remoteData = await remoteRes.json();
          farmData = mergeFarmData(farmData, remoteData, options);
          if (options.forceResetSubscription) {
            farmData.subscription = null;
          }
          importFarmData(farmData, false);
        }
      } catch (mergeErr) {
        console.warn("[GoogleSync] Aviso ao fundir dados remotos antes do upload:", mergeErr);
      }
    }

    if (options.forceResetSubscription) {
      farmData.subscription = null;
    }

    const jsonContent = JSON.stringify(farmData, null, 2);

    if (existingFileId) {
      const updateRes = await fetch(
        `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=media`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: jsonContent,
        }
      );
      if (!updateRes.ok) throw new Error("Erro ao atualizar ficheiro no Google Drive.");
    } else {
      const metadata = {
        name: DRIVE_FILE_NAME,
        mimeType: "application/json",
        description: "Cópia de segurança sincronizada da Minha Horta (Horta Viva)",
      };

      const boundary = "-------314159265358979323846";
      const delimiter = "\r\n--" + boundary + "\r\n";
      const closeDelim = "\r\n--" + boundary + "--";

      const multipartRequestBody =
        delimiter +
        "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
        JSON.stringify(metadata) +
        delimiter +
        "Content-Type: application/json\r\n\r\n" +
        jsonContent +
        closeDelim;

      const createRes = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": `multipart/related; boundary=${boundary}`,
          },
          body: multipartRequestBody,
        }
      );
      if (!createRes.ok) throw new Error("Erro ao criar ficheiro no Google Drive.");
      const created = await createRes.json();
      if (created.id) localStorage.setItem(STORAGE_KEYS.DRIVE_FILE_ID, created.id);
    }

    const now = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, now);
    notifySyncState("synced", "Quinta guardada no Google Drive automaticamente.");
    return { success: true, syncedAt: now };
  } catch (e) {
    notifySyncState(hasValidGoogleToken() ? "error" : "needs_reconnect", e.message);
    throw e;
  }
}

// Descarregar e sincronizar dados do Google Drive para o dispositivo local
export async function downloadFromGoogleDrive(interactive = false) {
  if (!isGoogleConnected()) return { skipped: true };
  notifySyncState("syncing", "A carregar dados do Google Drive...");
  try {
    const token = await getValidAccessToken(interactive);
    const fileId = await findDriveFile(token);

    if (!fileId) {
      notifySyncState("idle", "Ainda não existe ficheiro da quinta no Google Drive.");
      return { success: false, notFound: true };
    }

    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Erro ao ler ficheiro do Google Drive.");
    const remoteData = await res.json();

    const localData = exportFarmData();
    const mergedData = mergeFarmData(localData, remoteData);
    const result = importFarmData(mergedData, false);

    const now = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, now);
    notifySyncState("synced", "Dados da quinta sincronizados com o Google Drive.");
    return { success: true, ...result, syncedAt: now };
  } catch (e) {
    notifySyncState(hasValidGoogleToken() ? "error" : "needs_reconnect", e.message);
    throw e;
  }
}

// Sincronização bidirecional inteligente
export async function autoSyncGoogleDrive(interactive = false) {
  if (!isGoogleConfigured() || !isGoogleConnected()) return { skipped: true };
  try {
    const token = await getValidAccessToken(interactive);
    const fileId = await findDriveFile(token);

    if (fileId) {
      const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const remoteData = await res.json();
        const localData = exportFarmData();
        const mergedData = mergeFarmData(localData, remoteData);

        importFarmData(mergedData, false);

        const remotePlantingsCount = remoteData?.plantings?.length || 0;
        const remoteAnimalsCount = remoteData?.myAnimals?.length || 0;
        const mergedPlantingsCount = mergedData.plantings?.length || 0;
        const mergedAnimalsCount = mergedData.myAnimals?.length || 0;

        // Se local continha itens novos ou subscrição válida que a nuvem não tinha, atualiza a nuvem com os dados fundidos
        const remoteHasSub = Boolean(remoteData?.subscription?.active);
        const subUpdated = Boolean(mergedData?.subscription?.active) && !remoteHasSub;

        if (
          mergedPlantingsCount > remotePlantingsCount ||
          mergedAnimalsCount > remoteAnimalsCount ||
          subUpdated
        ) {
          const jsonContent = JSON.stringify(mergedData, null, 2);
          await fetch(
            `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: jsonContent,
            }
          );
        }

        const now = new Date().toISOString();
        localStorage.setItem(STORAGE_KEYS.LAST_SYNC, now);
        notifySyncState("synced", "Quinta sincronizada automaticamente.");

        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("hortaviva_remote_updated"));
        }
        return { success: true, syncedAt: now };
      }
    }

    // Se ainda não existe ficheiro no Drive, cria o primeiro ficheiro
    return await uploadToGoogleDrive(interactive);
  } catch (e) {
    console.warn("[GoogleSync] Sincronização em segundo plano pausada:", e?.message);
    if (!hasValidGoogleToken()) {
      notifySyncState("needs_reconnect", "Sessão expirada. Clica para sincronizar.");
    } else {
      notifySyncState("error", e?.message || "Erro na sincronização.");
    }
    if (interactive) throw e;
  }
}

/**
 * Sincroniza e restaura a subscrição Pro/Plus vinculada à Conta Google
 */
export async function syncSubscriptionWithGoogleAccount(interactive = true) {
  try {
    notifySyncState("syncing", "A sincronizar subscrição com a Conta Google...");
    if (!isGoogleConnected() || !hasValidGoogleToken()) {
      await connectGoogleDrive({ prompt: interactive ? "select_account" : "" });
    }
    await downloadFromGoogleDrive(interactive);

    const subRaw = localStorage.getItem("hortaviva_pro_subscription");
    const sub = subRaw ? JSON.parse(subRaw) : null;
    const googleUser = getGoogleUser();

    // Validar se a subscrição pertence realmente à conta autenticada
    const activeEmail = (googleUser?.email || "").toLowerCase().trim();
    const subEmail = (sub?.google_email || sub?.customer_email || "").toLowerCase().trim();
    const isOwner = Boolean(activeEmail && subEmail && activeEmail === subEmail);

    const isPro = isOwner && sub && sub.active && (sub.tier === "pro" || sub.plan === "pro") && !sub.is_master;
    const isPlus = isOwner && sub && sub.active && (sub.tier === "plus" || sub.plan === "plus");

    if (isPro || isPlus) {
      await uploadToGoogleDrive(false).catch(() => {});
      return {
        success: true,
        restored: true,
        tier: isPro ? "pro" : "plus",
        email: googleUser?.email || sub.customer_email,
      };
    }

    return {
      success: false,
      restored: false,
      reason: "not_found",
      email: googleUser?.email || "desconhecido",
    };
  } catch (err) {
    return {
      success: false,
      restored: false,
      error: err?.message || String(err),
    };
  }
}

// Auto-gravação automática em segundo plano a cada alteração na quinta ou subscrição
let autoSyncDebounceTimer = null;
if (typeof window !== "undefined") {
  window.addEventListener("hortaviva_data_changed", () => {
    if (!isGoogleConnected()) return;
    if (autoSyncDebounceTimer) clearTimeout(autoSyncDebounceTimer);
    autoSyncDebounceTimer = setTimeout(() => {
      autoSyncGoogleDrive(false).catch((err) => {
        console.warn("[GoogleSync] Falha na auto-gravação:", err);
      });
    }, 1200);
  });

  window.addEventListener("hortaviva_subscription_changed", () => {
    if (!isGoogleConnected()) return;
    if (autoSyncDebounceTimer) clearTimeout(autoSyncDebounceTimer);
    autoSyncDebounceTimer = setTimeout(() => {
      autoSyncGoogleDrive(false).catch((err) => {
        console.warn("[GoogleSync] Falha na sincronização de subscrição:", err);
      });
    }, 600);
  });
}
