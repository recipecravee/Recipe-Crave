import type { Metadata } from 'next';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Contact ${SITE.name}`,
  description: `Get in touch with the ${SITE.name} team. Questions, feedback, partnerships, press inquiries — we read every message.`,
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <div className="container py-12 lg:py-16">
      <article className="prose prose-lg container-prose mx-auto">
        <h1>Contact us</h1>
        <p>
          We read every email. The fastest way to reach us is{' '}
          <a href={`mailto:${SITE.email}`}>
            <strong>{SITE.email}</strong>
          </a>
          .
        </p>

        <h2>What we love hearing about</h2>
        <ul>
          <li>Recipe questions, substitution ideas, what we got wrong</li>
          <li>Features you want, problems you&apos;d like solved</li>
          <li>Partnership and editorial inquiries</li>
          <li>Bug reports and accessibility issues</li>
        </ul>

        <h2>Press</h2>
        <p>
          For press inquiries, please email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> with &ldquo;Press&rdquo; in the subject line. We aim to respond within two business days.
        </p>

        <h2>Mailing address</h2>
        <p>
          {SITE.publisher}<br />
          Online-only at this time. Postal correspondence by request.
        </p>
      </article>
    </div>
  );
}
