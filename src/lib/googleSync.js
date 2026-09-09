import { exportFarmData, importFarmData, localAuth } from "./localStorageStore.js";

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
        lastSync: getLastSyncTime(),
        user: getGoogleUser(),
        isConfigured: isGoogleConfigured(),
      },
    })
  );
}

// Iniciar sessão com a conta Google e obter permissão para o Google Drive
export async function connectGoogleDrive(options = {}) {
  const promptMode = options.prompt !== undefined ? options.prompt : "consent";
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

          // 2. Criar imediatamente um utilizador Google autenticado localmente
          let googleUser = {
            id: `google_${Date.now()}`,
            email: "agricultor.google@gmail.com",
            name: "Agricultor Google",
            full_name: "Agricultor Google",
            picture: "",
            avatar_url: "",
            avatar_emoji: "🌾",
            auth_provider: "google",
          };

          const prevInfo = getGoogleUser();
          if (prevInfo && prevInfo.email) {
            googleUser = { ...googleUser, ...prevInfo };
          }

          localStorage.setItem(STORAGE_KEYS.GOOGLE_USER, JSON.stringify(googleUser));
          localAuth.loginWithGoogleUser(googleUser, accessToken);

          // 3. Tentar enriquecer os dados através do endpoint de userinfo da Google
          try {
            const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (userRes.ok) {
              const profile = await userRes.json();
              googleUser = {
                ...googleUser,
                id: profile.sub || profile.id || googleUser.id,
                email: profile.email || googleUser.email,
                name: profile.name || googleUser.name,
                full_name: profile.name || googleUser.name,
                picture: profile.picture || "",
                avatar_url: profile.picture || "",
              };
              localStorage.setItem(STORAGE_KEYS.GOOGLE_USER, JSON.stringify(googleUser));
              localAuth.loginWithGoogleUser(googleUser, accessToken);
            }
          } catch (e) {
            console.warn("Não foi possível carregar o perfil Google detalhado:", e);
          }

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
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRES_AT);
  localStorage.removeItem(STORAGE_KEYS.GOOGLE_USER);
  localStorage.removeItem(STORAGE_KEYS.DRIVE_FILE_ID);
  notifySyncState("idle", "Desconectado do Google Drive");
}

export async function getValidAccessToken(interactive = false) {
  if (hasValidGoogleToken()) {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }
  if (!interactive) {
    // Tentar renovar silenciosamente em segundo plano sem abrir popup
    try {
      return await connectGoogleDrive({ prompt: "" });
    } catch (e) {
      console.warn("[GoogleSync] Renovação silenciosa de token falhou:", e);
      throw e;
    }
  }
  return connectGoogleDrive({ prompt: "consent" });
}

// Procurar ficheiro existente horta_viva_quinta.json no Google Drive
async function findDriveFile(token) {
  const cachedId = localStorage.getItem(STORAGE_KEYS.DRIVE_FILE_ID);
  if (cachedId) {
    // Validar se o ficheiro ainda existe
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
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,modifiedTime)`, {
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
export async function uploadToGoogleDrive(interactive = false) {
  if (!isGoogleConnected()) return { skipped: true };
  notifySyncState("syncing", "A enviar quinta para o Google Drive...");
  try {
    const token = await getValidAccessToken(interactive);
    const farmData = exportFarmData();
    const jsonContent = JSON.stringify(farmData, null, 2);
    const existingFileId = await findDriveFile(token);

    if (existingFileId) {
      // Atualizar ficheiro existente
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
      // Criar novo ficheiro com upload multipart
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
    notifySyncState("error", e.message);
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

    const result = importFarmData(remoteData);
    const now = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, now);
    notifySyncState("synced", "Dados da quinta sincronizados com o Google Drive.");
    return { success: true, ...result, syncedAt: now };
  } catch (e) {
    notifySyncState("error", e.message);
    throw e;
  }
}

// Sincronização bidirecional inteligente
export async function autoSyncGoogleDrive() {
  if (!isGoogleConfigured() || !isGoogleConnected()) return;
  try {
    const token = await getValidAccessToken(false);
    const fileId = await findDriveFile(token);
    if (fileId) {
      // Obter data de modificação no Drive
      const metaRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=modifiedTime`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (metaRes.ok) {
        const meta = await metaRes.json();
        const driveModified = new Date(meta.modifiedTime).getTime();
        const lastSync = new Date(getLastSyncTime() || 0).getTime();

        if (driveModified > lastSync + 5000) {
          console.log("[GoogleSync] Versão mais recente encontrada no Drive, a descarregar...");
          await downloadFromGoogleDrive(false);
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("hortaviva_remote_updated"));
          }
          return;
        }
      }
    }
    // Caso contrário, enviar as alterações locais para o Drive
    await uploadToGoogleDrive(false);
  } catch (e) {
    console.warn("[GoogleSync] Falha na sincronização automática em segundo plano:", e?.message);
  }
}

// Auto-gravação automática em segundo plano a cada alteração na quinta
let autoSyncDebounceTimer = null;
if (typeof window !== "undefined") {
  window.addEventListener("hortaviva_data_changed", () => {
    if (!isGoogleConnected()) return;
    if (autoSyncDebounceTimer) clearTimeout(autoSyncDebounceTimer);
    autoSyncDebounceTimer = setTimeout(() => {
      autoSyncGoogleDrive().catch((err) => {
        console.warn("[GoogleSync] Falha na auto-gravação:", err);
      });
    }, 1200);
  });
}
