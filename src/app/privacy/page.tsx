import type { Metadata } from "next";
import Link from "next/link";
import { LegalList, LegalPage, LegalSection } from "@/components/legal/legal-page";
import { DATA_PROCESSORS, LEGAL, LEGAL_LINKS } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy · Pace",
  description:
    "What Pace collects, why, who it is shared with, how long it is kept, and how to delete it.",
  alternates: { canonical: LEGAL_LINKS.privacy },
};

export default function PrivacyPage() {
  const mail = (
    <a className="underline underline-offset-4" href={`mailto:${LEGAL.contactEmail}`}>
      {LEGAL.contactEmail}
    </a>
  );

  return (
    <LegalPage eyebrow="Pace · Privacy" title="Privacy Policy" updated={LEGAL.privacyUpdated}>
      <LegalSection title="The short version">
        <LegalList>
          <li>Pace is a food diary and weight-management app for adults aged 18 and over.</li>
          <li>We use what you enter (your body details, goals, meals, weights and photos) to run the app for you. Nothing else.</li>
          <li>We never sell your data, never use it for advertising, and never track you across other apps or websites.</li>
          <li>Meal photos and coach messages go to our AI provider, OpenAI, only after you say yes, and are not used to train its models.</li>
          <li>You can delete your account and all of its data from Settings at any time.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="Who we are">
        <p>
          Pace is run by {LEGAL.operator} (&ldquo;we&rdquo;, &ldquo;us&rdquo;), who is the data
          controller for the personal data described here. Contact us about privacy at {mail}.
        </p>
      </LegalSection>

      <LegalSection title="What we collect">
        <LegalList>
          <li><strong>Account details:</strong> your email address, a user ID, and your name if you choose to give one. If you use Continue with Google, Google tells us your email address.</li>
          <li><strong>Body and goal details:</strong> age, sex (used only for the calorie formula), height, current and goal weight, activity level, routine and diet preferences.</li>
          <li><strong>Health and fitness logs:</strong> meals and their nutrition, weights, check-ins, water, steps and workouts you log.</li>
          <li><strong>Photos:</strong> meal photos you take or choose, and progress photos you add. We only access the camera or photo library when you tap to use it.</li>
          <li><strong>Health check answers:</strong> whether you are pregnant or breastfeeding, have an eating disorder, or follow a clinician-managed diet. These stay on your device and are only used to switch off weight-loss goals.</li>
          <li><strong>Coach messages:</strong> what you ask the coach and its replies.</li>
          <li><strong>Subscription status:</strong> whether you have a trial or Premium, from Apple, Google and RevenueCat. We never see your card details.</li>
          <li><strong>App usage:</strong> a small set of in-app events (for example &ldquo;meal logged&rdquo;), the app version and your device&rsquo;s browser type, linked to your account, so we can see which features work and fix problems.</li>
        </LegalList>
        <p>
          Some of this, such as coach conversations, water and step counts, progress photos,
          reminders and food preferences, is stored only on your device. Your profile, targets,
          meals, weights and check-ins are also saved to your account so they survive a new phone.
        </p>
      </LegalSection>

      <LegalSection title="Why we use it, and our legal basis">
        <LegalList>
          <li><strong>To provide the app you signed up for</strong> (calculate targets, keep your diary, sync it): performance of our contract with you.</li>
          <li><strong>Health information</strong> such as weight and food logs is special category data. We process it only with your explicit consent, which you give when you set up Pace. You can withdraw it at any time by deleting your account.</li>
          <li><strong>AI meal estimates and the coach</strong>: your consent, asked the first time you use them. You can turn this off in Settings.</li>
          <li><strong>Security, fixing bugs and understanding which features are used</strong>: our legitimate interest in running a safe, working app.</li>
          <li><strong>Keeping records we are required to keep</strong>, such as purchase records: legal obligation.</li>
        </LegalList>
      </LegalSection>

      <LegalSection id="ai" title="AI features and OpenAI">
        <p>
          When you ask Pace to estimate a meal from a photo, the photo is sent to OpenAI to identify the
          food and estimate portions. When you message the coach, your message, a short summary of your
          profile (age, height, weight, goal, activity) and today&rsquo;s totals are sent to OpenAI to
          write a reply. We ask for your permission before the first time either happens.
        </p>
        <p>
          We use OpenAI&rsquo;s business API. Under its terms, OpenAI does not use this data to train its
          models, we ask it not to store responses, and it may keep request logs for up to 30 days only
          to detect abuse. AI answers can be wrong: always check an estimate before saving it, and treat
          the coach as general wellness information, not medical advice.
        </p>
      </LegalSection>

      <LegalSection title="Who we share it with">
        <p>
          We share personal data only with the service providers that run Pace for us, under contracts
          that limit them to acting on our instructions:
        </p>
        <LegalList>
          {DATA_PROCESSORS.map((p) => (
            <li key={p.name}>
              <strong>{p.name}:</strong> {p.purpose}
            </li>
          ))}
        </LegalList>
        <p>
          We may also disclose data if the law requires it, or to protect the safety of users or the
          service. If Pace is ever sold or transferred, your data would move with it under this policy
          and we would tell you first. We do not sell or rent personal data, and we do not share it for
          advertising.
        </p>
      </LegalSection>

      <LegalSection title="International transfers">
        <p>
          Some of these providers process data in the United States. Where data leaves the UK or EEA we
          rely on safeguards the law recognises, such as the UK International Data Transfer Addendum,
          the EU Standard Contractual Clauses, or the UK-US and EU-US Data Privacy Framework.
        </p>
      </LegalSection>

      <LegalSection title="How long we keep it">
        <LegalList>
          <li>Your account data is kept while you have an account.</li>
          <li>When you delete your account, your account, logs and stored photos are deleted straight away. Copies in encrypted backups are overwritten within 30 days.</li>
          <li>Purchase records held by Apple, Google and RevenueCat are kept as those companies require for tax and accounting.</li>
          <li>Hosting request logs are kept for a short time (usually days) for security.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="Your rights and choices">
        <p>
          You can see and edit your details in the app, turn off AI features in Settings, and delete your
          account from <strong>Settings → Delete account</strong> or at{" "}
          <Link className="underline underline-offset-4" href={LEGAL_LINKS.deleteAccount}>
            the account deletion page
          </Link>
          . You also have the right to ask for a copy of your data, to correct it, to restrict or object
          to how we use it, to move it to another service, and to withdraw consent. Email {mail} and we
          will reply within one month.
        </p>
        <p>
          If you are unhappy with how we handle your data, please tell us first. You can also complain to
          the UK Information Commissioner&rsquo;s Office (ico.org.uk) or the data protection authority
          where you live.
        </p>
      </LegalSection>

      <LegalSection title="US state privacy rights">
        <p>
          Some US states give residents extra rights over personal and consumer health data, such as
          the right to know what is collected, to delete it, and to withdraw consent. Everything above
          applies to you: we collect health data only to provide the app, with your consent, we do not
          sell it or use it for targeted advertising, and you can use the rights above by emailing {mail}.
          If we decline a request you can appeal by replying to that email.
        </p>
      </LegalSection>

      <LegalSection title="Apple Health and Android Health Connect">
        <p>
          If you connect Apple Health or Android Health Connect, Pace reads only the step count and body
          weight you allow, to show your steps and keep your weight history up to date. You can revoke
          access at any time in the Health app on iPhone, or in the Health Connect app or Android
          Settings → Apps → Pace → Permissions. Data from Apple Health or Health Connect is never used
          for advertising or marketing, never sold, and never shared with third parties except as needed
          to show it to you in Pace.
        </p>
      </LegalSection>

      <LegalSection title="Reminders">
        <p>
          If you turn on reminders they are scheduled on your device. Reminder settings are not sent to
          our servers.
        </p>
      </LegalSection>

      <LegalSection title="Security">
        <p>
          Data is encrypted in transit (HTTPS) and at rest by our hosting providers, and access to your
          account data is restricted to you. No system is perfectly secure, so please use a strong,
          unique password.
        </p>
      </LegalSection>

      <LegalSection title="Children">
        <p>
          Pace is for adults aged {LEGAL.minimumAge} and over and is not directed at children. If we learn
          that someone under {LEGAL.minimumAge} has created an account, we will delete it.
        </p>
      </LegalSection>

      <LegalSection title="Changes to this policy">
        <p>
          We will update the date at the top when this policy changes, and tell you in the app before any
          change that affects how your data is used.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
