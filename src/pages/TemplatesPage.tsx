import React, { useEffect, useState } from 'react';
import {
  ExternalLink,
  Eye,
  MessageCircle,
  Monitor,
  Smartphone,
  X,
} from 'lucide-react';
import { CustomerLayout } from '../components/Layout';
import { SEED_TEMPLATES } from '../data/seedData';
import { subscribePublicTemplates } from '../lib/firestoreService';
import {
  formatWhatsAppUrl,
  isSafeUrl,
  type TemplateItem,
} from '../types/nivanto';

export function TemplatesPage() {
  const [templates, setTemplates] = useState<TemplateItem[]>(
    SEED_TEMPLATES.map((t, i) => ({ ...t, id: `seed_tpl_${i + 1}` }))
  );
  const [previewTemplate, setPreviewTemplate] = useState<TemplateItem | null>(
    null
  );
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [iframeFailed, setIframeFailed] = useState(false);

  useEffect(() => {
    const unsub = subscribePublicTemplates((items) => setTemplates(items));
    return () => unsub();
  }, []);

  const openPreview = (tpl: TemplateItem) => {
    setIframeFailed(false);
    setPreviewMode('desktop');
    setPreviewTemplate(tpl);
  };

  return (
    <CustomerLayout>
      {/* Header */}
      <section className="bg-[#1C2440] text-white py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-6 space-y-4">
          <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#E8900A]">
            Readymade Websites
          </p>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-white text-balance">
            Launch-ready templates built for Bangladesh businesses
          </h1>
          <p className="text-base text-white/65 max-w-2xl leading-relaxed">
            Preview any template live before you decide. Customized with your logo, products, and domain — delivered fast with 30-day bug-fix support.
          </p>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="max-w-[1200px] mx-auto px-6 py-16">
        {templates.length === 0 ? (
          <div className="rounded-[22px] bg-white border border-[#E5E1D8] p-12 text-center">
            <p className="font-display font-bold text-lg text-[#1C2440]">
              No active templates right now
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {templates.map((tpl) => {
              const waUrl = formatWhatsAppUrl(
                tpl.whatsapp_number || '+8801720266825',
                `Hi Nivanto, I'm interested in the ${tpl.title} template`
              );
              const safeImg =
                isSafeUrl(tpl.image_url) ||
                tpl.image_url.startsWith('data:image/svg+xml')
                  ? tpl.image_url
                  : '';

              return (
                <article
                  key={tpl.id}
                  className="rounded-[22px] bg-white border border-[#E5E1D8] overflow-hidden flex flex-col justify-between transition-colors duration-200 hover:border-[#2B5FAA]/45"
                >
                  <div>
                    <div className="aspect-[16/10] bg-[#EDEAE4] overflow-hidden border-b border-[#E5E1D8]">
                      {safeImg ? (
                        <img
                          src={safeImg}
                          alt={`${tpl.title} template preview`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#1C2440] text-white font-display font-bold text-xl p-6 text-center">
                          {tpl.title}
                        </div>
                      )}
                    </div>

                    <div className="p-7 space-y-3">
                      <div className="flex items-baseline justify-between gap-4">
                        <h2 className="font-display font-bold text-2xl text-[#1C2440]">
                          {tpl.title}
                        </h2>
                        <span className="font-display font-extrabold text-2xl text-[#2B5FAA] tabular-nums shrink-0">
                          {tpl.currency}
                          {tpl.price}
                        </span>
                      </div>
                      <p className="text-sm text-[#6B7280] leading-relaxed">
                        {tpl.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-7 pb-7 pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => openPreview(tpl)}
                      className="inline-flex items-center justify-center gap-2 flex-1 min-w-[130px] px-5 py-3 rounded-[14px] bg-[#F8F6F2] border border-[#E5E1D8] text-[#1C2440] text-sm font-semibold hover:border-[#2B5FAA] hover:text-[#2B5FAA] transition-colors whitespace-nowrap"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 flex-1 min-w-[130px] px-5 py-3 rounded-[14px] bg-[#E8900A] text-white text-sm font-semibold hover:bg-[#d38108] transition-colors whitespace-nowrap"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Get This
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Fullscreen Interactive Template Preview Modal */}
      {previewTemplate && (
        <div
          className="fixed inset-0 z-50 bg-[#1C2440]/85 backdrop-blur-sm flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={`Live preview of ${previewTemplate.title}`}
        >
          {/* Modal Top Bar */}
          <div className="bg-[#1C2440] text-white border-b border-white/10 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-display font-bold text-base truncate">
                {previewTemplate.title}
              </p>
              <p className="text-xs text-white/55 tabular-nums">
                {previewTemplate.currency}
                {previewTemplate.price} · Interactive Live Preview
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-1 p-1 rounded-[12px] bg-white/10">
              <button
                type="button"
                onClick={() => setPreviewMode('desktop')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] text-xs font-medium transition-colors ${
                  previewMode === 'desktop'
                    ? 'bg-[#2B5FAA] text-white'
                    : 'text-white/65 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('mobile')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[9px] text-xs font-medium transition-colors ${
                  previewMode === 'mobile'
                    ? 'bg-[#2B5FAA] text-white'
                    : 'text-white/65 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Mobile
              </button>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isSafeUrl(previewTemplate.live_url) && (
                <a
                  href={previewTemplate.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] border border-white/20 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  Open Tab
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <a
                href={formatWhatsAppUrl(
                  previewTemplate.whatsapp_number || '+8801720266825',
                  `Hi Nivanto, I'm interested in the ${previewTemplate.title} template`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-[#E8900A] text-white text-xs font-semibold hover:bg-[#d38108] transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Get This
              </a>
              <button
                type="button"
                aria-label="Close live preview"
                onClick={() => setPreviewTemplate(null)}
                className="inline-flex items-center justify-center w-9 h-9 rounded-[10px] bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Iframe Area */}
          <div className="flex-1 overflow-auto p-3 sm:p-6 flex items-center justify-center">
            <div
              className={`bg-white rounded-[18px] overflow-hidden shadow-2xl border border-white/15 h-full transition-all duration-200 ${
                previewMode === 'mobile' ? 'w-[390px] max-w-full' : 'w-full max-w-[1320px]'
              }`}
            >
              {isSafeUrl(previewTemplate.live_url) && !iframeFailed ? (
                <iframe
                  src={previewTemplate.live_url}
                  title={`Live preview of ${previewTemplate.title}`}
                  onError={() => setIframeFailed(true)}
                  className="w-full h-full border-0"
                  style={{ pointerEvents: 'auto' }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center space-y-4 bg-[#F8F6F2]">
                  <p className="font-display font-bold text-xl text-[#1C2440]">
                    Interactive embed blocked by external host
                  </p>
                  <p className="text-sm text-[#6B7280] max-w-md">
                    This preview host disables inline framing. You can inspect the live template directly in a dedicated browser tab.
                  </p>
                  {isSafeUrl(previewTemplate.live_url) && (
                    <a
                      href={previewTemplate.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[12px] bg-[#2B5FAA] text-white text-sm font-semibold"
                    >
                      Open Live Preview
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </CustomerLayout>
  );
}
