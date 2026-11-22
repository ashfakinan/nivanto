import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore';
import {
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_HOME_CONTENT,
  SEED_PORTFOLIO,
  SEED_SERVICES,
  SEED_TEMPLATES,
} from '../data/seedData';
import type {
  AboutContent,
  HomeContent,
  InquiryItem,
  PortfolioItem,
  ServiceItem,
  TemplateItem,
} from '../types/nivanto';
import { db, handleFirestoreError, OperationType } from './firebase';

function makeDocId(prefix: string): string {
  const random =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 16)
      : `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}_${random}`;
}

function clampStr(val: string, maxLen: number): string {
  return String(val ?? '').trim().slice(0, maxLen);
}

// ── Content Subscriptions ──

export function subscribeHomeContent(
  onData: (data: HomeContent, fromDb: boolean) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const ref = doc(db, 'content', 'home');
  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        const d = snap.data() as Partial<HomeContent>;
        onData(
          {
            hero_headline: d.hero_headline || DEFAULT_HOME_CONTENT.hero_headline,
            hero_subtext: d.hero_subtext || DEFAULT_HOME_CONTENT.hero_subtext,
            intro_paragraph: d.intro_paragraph || DEFAULT_HOME_CONTENT.intro_paragraph,
            cta_text: d.cta_text || DEFAULT_HOME_CONTENT.cta_text,
            updated_at: d.updated_at,
          },
          true
        );
      } else {
        onData(DEFAULT_HOME_CONTENT, false);
      }
    },
    (error) => {
      if (onError) onError(error);
      try {
        handleFirestoreError(error, OperationType.GET, 'content/home');
      } catch {
        onData(DEFAULT_HOME_CONTENT, false);
      }
    }
  );
}

export function subscribeAboutContent(
  onData: (data: AboutContent, fromDb: boolean) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const ref = doc(db, 'content', 'about');
  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        const d = snap.data() as Partial<AboutContent>;
        onData(
          {
            who_we_are: d.who_we_are || DEFAULT_ABOUT_CONTENT.who_we_are,
            vision: d.vision || DEFAULT_ABOUT_CONTENT.vision,
            wings_summary: d.wings_summary || DEFAULT_ABOUT_CONTENT.wings_summary,
            updated_at: d.updated_at,
          },
          true
        );
      } else {
        onData(DEFAULT_ABOUT_CONTENT, false);
      }
    },
    (error) => {
      if (onError) onError(error);
      try {
        handleFirestoreError(error, OperationType.GET, 'content/about');
      } catch {
        onData(DEFAULT_ABOUT_CONTENT, false);
      }
    }
  );
}

// ── Services Subscriptions ──

export function subscribePublicServices(
  onData: (items: ServiceItem[], fromDb: boolean) => void
): Unsubscribe {
  const q = query(collection(db, 'services'), where('active', '==', true));
  return onSnapshot(
    q,
    (snap) => {
      if (snap.empty) {
        onData(
          SEED_SERVICES.map((s, idx) => ({ ...s, id: `seed_svc_${idx + 1}` })),
          false
        );
        return;
      }
      const items = snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as Omit<ServiceItem, 'id'>) }))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      onData(items, true);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, 'services');
      } catch {
        onData(
          SEED_SERVICES.map((s, idx) => ({ ...s, id: `seed_svc_${idx + 1}` })),
          false
        );
      }
    }
  );
}

export function subscribeAllServices(
  onData: (items: ServiceItem[]) => void
): Unsubscribe {
  const q = query(collection(db, 'services'), orderBy('order', 'asc'));
  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<ServiceItem, 'id'>),
      }));
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'services');
    }
  );
}

// ── Portfolio Subscriptions ──

export function subscribePublicPortfolio(
  onData: (items: PortfolioItem[], fromDb: boolean) => void
): Unsubscribe {
  const q = query(collection(db, 'portfolio'), where('active', '==', true));
  return onSnapshot(
    q,
    (snap) => {
      if (snap.empty) {
        onData(
          SEED_PORTFOLIO.map((p, idx) => ({ ...p, id: `seed_port_${idx + 1}` })),
          false
        );
        return;
      }
      const items = snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as Omit<PortfolioItem, 'id'>) }))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      onData(items, true);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, 'portfolio');
      } catch {
        onData(
          SEED_PORTFOLIO.map((p, idx) => ({ ...p, id: `seed_port_${idx + 1}` })),
          false
        );
      }
    }
  );
}

export function subscribeAllPortfolio(
  onData: (items: PortfolioItem[]) => void
): Unsubscribe {
  const q = query(collection(db, 'portfolio'), orderBy('order', 'asc'));
  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<PortfolioItem, 'id'>),
      }));
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'portfolio');
    }
  );
}

// ── Templates Subscriptions ──

export function subscribePublicTemplates(
  onData: (items: TemplateItem[], fromDb: boolean) => void
): Unsubscribe {
  const q = query(collection(db, 'templates'), where('active', '==', true));
  return onSnapshot(
    q,
    (snap) => {
      if (snap.empty) {
        onData(
          SEED_TEMPLATES.map((t, idx) => ({ ...t, id: `seed_tpl_${idx + 1}` })),
          false
        );
        return;
      }
      const items = snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as Omit<TemplateItem, 'id'>) }))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      onData(items, true);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, 'templates');
      } catch {
        onData(
          SEED_TEMPLATES.map((t, idx) => ({ ...t, id: `seed_tpl_${idx + 1}` })),
          false
        );
      }
    }
  );
}

export function subscribeAllTemplates(
  onData: (items: TemplateItem[]) => void
): Unsubscribe {
  const q = query(collection(db, 'templates'), orderBy('order', 'asc'));
  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<TemplateItem, 'id'>),
      }));
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'templates');
    }
  );
}

// ── Inquiries Subscription (Admin Only) ──

export function subscribeInquiries(
  onData: (items: InquiryItem[]) => void
): Unsubscribe {
  const q = query(collection(db, 'inquiries'), orderBy('timestamp', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<InquiryItem, 'id'>),
      }));
      onData(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'inquiries');
    }
  );
}

// ── Admin Write Operations ──

export async function saveHomeContent(data: HomeContent): Promise<void> {
  try {
    await setDoc(doc(db, 'content', 'home'), {
      hero_headline: clampStr(data.hero_headline, 160),
      hero_subtext: clampStr(data.hero_subtext, 320),
      intro_paragraph: clampStr(data.intro_paragraph, 800),
      cta_text: clampStr(data.cta_text, 200),
      updated_at: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'content/home');
  }
}

export async function saveAboutContent(data: AboutContent): Promise<void> {
  try {
    await setDoc(doc(db, 'content', 'about'), {
      who_we_are: clampStr(data.who_we_are, 2000),
      vision: clampStr(data.vision, 2000),
      wings_summary: clampStr(data.wings_summary, 2000),
      updated_at: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'content/about');
  }
}

export async function upsertService(
  item: Omit<ServiceItem, 'id'> & { id?: string }
): Promise<string> {
  const id = item.id && /^[a-zA-Z0-9_-]+$/.test(item.id) ? item.id : makeDocId('svc');
  const payload = {
    title: clampStr(item.title, 120),
    description: clampStr(item.description, 1000),
    price: clampStr(item.price, 60),
    currency: clampStr(item.currency || '৳', 8),
    features: (item.features || [])
      .map((f) => clampStr(f, 200))
      .filter(Boolean)
      .slice(0, 12),
    wing: clampStr(item.wing, 80),
    featured: Boolean(item.featured),
    order: Number(item.order) || 1,
    active: Boolean(item.active),
  };
  try {
    await setDoc(doc(db, 'services', id), payload);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `services/${id}`);
  }
}

export async function deleteService(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'services', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `services/${id}`);
  }
}

export async function upsertPortfolio(
  item: Omit<PortfolioItem, 'id'> & { id?: string }
): Promise<string> {
  const id = item.id && /^[a-zA-Z0-9_-]+$/.test(item.id) ? item.id : makeDocId('port');
  const payload = {
    title: clampStr(item.title, 120),
    description: clampStr(item.description, 1000),
    image_url: clampStr(item.image_url, 1000),
    live_url: clampStr(item.live_url, 1000),
    category: clampStr(item.category, 80),
    featured: Boolean(item.featured),
    order: Number(item.order) || 1,
    active: Boolean(item.active),
  };
  try {
    await setDoc(doc(db, 'portfolio', id), payload);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `portfolio/${id}`);
  }
}

export async function deletePortfolio(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'portfolio', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `portfolio/${id}`);
  }
}

export async function upsertTemplate(
  item: Omit<TemplateItem, 'id'> & { id?: string }
): Promise<string> {
  const id = item.id && /^[a-zA-Z0-9_-]+$/.test(item.id) ? item.id : makeDocId('tpl');
  const payload = {
    title: clampStr(item.title, 120),
    description: clampStr(item.description, 1000),
    image_url: clampStr(item.image_url, 1000),
    live_url: clampStr(item.live_url, 1000),
    price: clampStr(item.price, 60),
    currency: clampStr(item.currency || '৳', 8),
    whatsapp_number: clampStr(item.whatsapp_number, 24),
    active: Boolean(item.active),
    order: Number(item.order) || 1,
  };
  try {
    await setDoc(doc(db, 'templates', id), payload);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `templates/${id}`);
  }
}

export async function deleteTemplate(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'templates', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `templates/${id}`);
  }
}

// ── Public Contact Submission & Admin Inquiry Actions ──

export async function submitInquiry(input: {
  name: string;
  business_name: string;
  phone: string;
  service: string;
  message: string;
}): Promise<string> {
  const id = makeDocId('inq');
  const payload = {
    name: clampStr(input.name, 120),
    business_name: clampStr(input.business_name, 160),
    phone: clampStr(input.phone, 40),
    service: clampStr(input.service, 120),
    message: clampStr(input.message, 2000),
    timestamp: serverTimestamp(),
    read: false,
  };
  try {
    await setDoc(doc(db, 'inquiries', id), payload);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `inquiries/${id}`);
  }
}

export async function toggleInquiryRead(id: string, read: boolean): Promise<void> {
  try {
    await updateDoc(doc(db, 'inquiries', id), { read: Boolean(read) });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `inquiries/${id}`);
  }
}

export async function deleteInquiry(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'inquiries', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `inquiries/${id}`);
  }
}

// ── Seed Initial Nivanto Content to Firestore (Admin Only) ──

export async function seedAllDefaultData(): Promise<void> {
  try {
    const batch = writeBatch(db);

    batch.set(doc(db, 'content', 'home'), {
      ...DEFAULT_HOME_CONTENT,
      updated_at: serverTimestamp(),
    });

    batch.set(doc(db, 'content', 'about'), {
      ...DEFAULT_ABOUT_CONTENT,
      updated_at: serverTimestamp(),
    });

    SEED_SERVICES.forEach((svc, idx) => {
      batch.set(doc(db, 'services', `nivanto_svc_${idx + 1}`), svc);
    });

    SEED_PORTFOLIO.forEach((port, idx) => {
      batch.set(doc(db, 'portfolio', `nivanto_port_${idx + 1}`), port);
    });

    SEED_TEMPLATES.forEach((tpl, idx) => {
      batch.set(doc(db, 'templates', `nivanto_tpl_${idx + 1}`), tpl);
    });

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'seedAllDefaultData');
  }
}
