import type { Metadata } from 'next';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Read the ${SITE.name} privacy policy: how we collect, use, and protect your data. GDPR and CCPA compliant.`,
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="container py-12 lg:py-16">
      <article className="prose prose-lg container-prose mx-auto">
        <h1>Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <p>
          {SITE.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates {SITE.url}. This policy explains what data we collect, how we use it, and your rights over it.
        </p>

        <h2>Information we collect</h2>
        <h3>Information you provide</h3>
        <ul>
          <li>Email address (newsletter, account)</li>
          <li>Account information (name, dietary preferences, allergies, household size, budget)</li>
          <li>User-generated content (saved recipes, reviews, comments, photos)</li>
        </ul>

        <h3>Information collected automatically</h3>
        <ul>
          <li>Usage data (pages viewed, search queries, clicks) via privacy-respecting analytics (Umami, PostHog)</li>
          <li>Technical data (browser type, device type, country-level location)</li>
          <li>Cookies (essential and, with consent, advertising/measurement)</li>
        </ul>

        <h2>How we use your information</h2>
        <ul>
          <li>Operate and improve the service</li>
          <li>Personalize recommendations and AI meal plans</li>
          <li>Send transactional and (opt-in) marketing emails</li>
          <li>Measure traffic and feature usage</li>
          <li>Show advertising via Google AdSense (with your consent, where required)</li>
        </ul>

        <h2>Cookies and advertising</h2>
        <p>
          We use Google AdSense to show ads. AdSense uses cookies and similar technologies to serve ads based on prior visits to our site and other sites. You can opt out of personalized advertising by visiting
          {' '}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
        </p>
        <p>
          We respect Do Not Track signals and offer a clear consent banner to users in regions requiring it (EU/UK/EEA under GDPR, California under CCPA).
        </p>

        <h2>Third-party services we use</h2>
        <ul>
          <li><strong>Supabase</strong> — database, authentication, storage</li>
          <li><strong>Vercel</strong> — hosting and CDN</li>
          <li><strong>Cloudflare</strong> — CDN, DNS, edge analytics</li>
          <li><strong>Google Gemini, Groq</strong> — AI features (no personal data shared beyond your prompt)</li>
          <li><strong>USDA FoodData Central</strong> — nutrition data (no personal data shared)</li>
          <li><strong>Resend</strong> — transactional email</li>
          <li><strong>Sentry</strong> — error monitoring (IP anonymized)</li>
          <li><strong>Umami, PostHog</strong> — privacy-respecting analytics</li>
          <li><strong>Google AdSense</strong> — advertising</li>
        </ul>

        <h2>Your rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you</li>
          <li>Correct inaccurate data</li>
          <li>Delete your data (right to be forgotten)</li>
          <li>Export your data in a portable format</li>
          <li>Object to or restrict processing</li>
          <li>Withdraw consent for marketing or advertising at any time</li>
        </ul>
        <p>To exercise these rights, email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>

        <h2 id="ccpa">Your California rights (CCPA / CPRA)</h2>
        <p>
          If you are a California resident, the California Consumer Privacy Act
          (CCPA) and the California Privacy Rights Act (CPRA) give you specific
          rights regarding your personal information:
        </p>
        <ul>
          <li><strong>Right to know.</strong> You may request the categories of personal information we collect, the sources, the purposes of collection, and the categories of third parties with whom we share it.</li>
          <li><strong>Right to delete.</strong> You may request deletion of the personal information we have collected from you, subject to legal exceptions.</li>
          <li><strong>Right to correct.</strong> You may request that we correct inaccurate personal information.</li>
          <li><strong>Right to opt out of sale or sharing.</strong> We do not sell your personal information for money. If we use cookies for cross-context behavioral advertising, that constitutes "sharing" under CPRA; you may opt out at any time using the <strong>"Do Not Sell or Share My Information"</strong> button in the cookie banner, or by emailing us.</li>
          <li><strong>Right to limit use of sensitive personal information.</strong> We do not collect sensitive personal information beyond what is strictly necessary to provide the service.</li>
          <li><strong>Right to non-discrimination.</strong> Exercising any of these rights will not result in different pricing, denial of service, or any other adverse treatment.</li>
        </ul>
        <p>
          To submit a request, email <a href={`mailto:${SITE.email}`}>{SITE.email}</a> with
          the subject line "California Privacy Request." We verify identity before disclosure or
          deletion and respond within 45 days as required by law. You may also designate an
          authorized agent to make requests on your behalf.
        </p>
        <p>
          For Nevada residents: you may opt out of any future sale of personal information by
          emailing the address above.
        </p>

        <h2>Your Virginia, Colorado, Connecticut, Utah, and other state rights</h2>
        <p>
          Residents of Virginia (VCDPA), Colorado (CPA), Connecticut (CTDPA), Utah (UCPA), and
          other states with comprehensive consumer privacy laws have substantially the same
          rights of access, correction, deletion, portability, and opt-out described above.
          Use the same email address and we will route the request appropriately.
        </p>

        <h2>Data retention</h2>
        <p>We keep your data only as long as needed to provide the service. Account data is deleted within 30 days of an account deletion request. Anonymized analytics may be retained longer.</p>

        <h2>Children</h2>
        <p>Our service is not directed to children under 13 (or 16 in the EU/UK). We do not knowingly collect data from children.</p>

        <h2>International transfers</h2>
        <p>Our servers and processors may be located outside your country. We use Standard Contractual Clauses and equivalent safeguards for international transfers.</p>

        <h2>Changes to this policy</h2>
        <p>We will post updates here. Material changes will be notified by email or prominent notice on the site.</p>

        <h2>Contact</h2>
        <p>Privacy questions: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
      </article>
    </div>
  );
}
