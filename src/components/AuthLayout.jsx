import { useI18n } from "@/lib/I18nContext";
import React from "react";
export default function AuthLayout({
  icon: Icon,
  title,
  subtitle,
  footer,
  children
}) {
  const {
    t: i18nT
  } = useI18n();
  return <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-3">
            <img src={`${import.meta.env.BASE_URL}logo.jpg`} alt={i18nT("Horta Viva")} className="w-20 h-20 rounded-2xl shadow-md border-2 border-emerald-100 object-cover" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{i18nT(title)}</h1>
          {subtitle && <p className="text-muted-foreground mt-2">{i18nT(subtitle)}</p>}
        </div>
        <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
          {i18nT(children)}
        </div>
        {footer && <p className="text-center text-sm text-muted-foreground mt-6">{i18nT(footer)}</p>}
      </div>
    </div>;
}
