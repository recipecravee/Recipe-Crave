import type { Metadata } from 'next';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `Read the ${SITE.name} terms of service.`,
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <div className="container py-12 lg:py-16">
      <article className="prose prose-lg container-prose mx-auto">
        <h1>Terms of Service</h1>
        <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <p>
          Welcome to {SITE.name}. By using {SITE.url} (the &ldquo;Service&rdquo;), you agree to these terms. Read them carefully.
        </p>

        <h2>1. Acceptance of terms</h2>
        <p>By accessing or using the Service, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, do not use the Service.</p>

        <h2>2. The Service</h2>
        <p>
          {SITE.name} is a free recipe discovery, meal planning, and cooking platform. We may add, modify, or remove features at any time. We aim to keep core features free.
        </p>

        <h2>3. User accounts</h2>
        <p>You may use the Service without an account. With an account, you are responsible for the security of your credentials. Notify us immediately of any unauthorized use.</p>

        <h2>4. User content</h2>
        <p>
          You retain ownership of content you submit (reviews, photos, comments). By submitting, you grant us a worldwide, non-exclusive, royalty-free license to use, display, and distribute your content as needed to operate the Service.
        </p>
        <p>You agree not to submit content that is unlawful, infringing, harmful, hateful, or violates anyone&apos;s rights.</p>

        <h2>5. AI-generated content</h2>
        <p>
          Some content on the Service is generated or assisted by AI (clearly labeled where applicable). AI output may contain errors. Always use your own judgment, especially around food safety, allergens, and dietary restrictions.
        </p>

        <h2>6. Recipe accuracy and food safety</h2>
        <p>
          Recipes are provided for general informational and entertainment purposes. We do our best to test recipes and provide accurate nutrition data, but cooking is variable. You are responsible for your own food safety, ingredient handling, and dietary decisions. Consult a qualified professional for medical or nutritional advice.
        </p>

        <h2>7. Intellectual property</h2>
        <p>
          The Service, including its design, text, logos, and original recipes, is the property of {SITE.publisher} and protected by copyright and trademark law. You may print or share recipes for personal use. Republication requires written permission.
        </p>

        <h2>8. Third-party links and services</h2>
        <p>
          We may link to third-party sites (grocery retailers, affiliates). We are not responsible for the content, policies, or practices of those sites.
        </p>

        <h2>9. Advertising</h2>
        <p>
          The Service is supported by advertising, including Google AdSense. Some links may be affiliate links from which we earn a commission at no extra cost to you.
        </p>

        <h2>10. Termination</h2>
        <p>
          We may suspend or terminate your access to the Service at our discretion, especially for violations of these Terms. You may stop using the Service at any time and request account deletion via <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>

        <h2>11. Disclaimers</h2>
        <p>
          THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; WITHOUT WARRANTIES OF ANY KIND. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR ACCURATE.
        </p>

        <h2>12. Limitation of liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, {SITE.publisher.toUpperCase()} SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
        </p>

        <h2>13. Governing law</h2>
        <p>These Terms are governed by the laws of the jurisdiction in which {SITE.publisher} is established. Disputes will be resolved in those courts.</p>

        <h2>14. Changes</h2>
        <p>We may update these Terms. Material changes will be notified by email or prominent notice on the site.</p>

        <h2>15. Contact</h2>
        <p>Questions? Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
      </article>
    </div>
  );
}
