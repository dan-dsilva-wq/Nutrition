import type { Metadata } from "next";
import Link from "next/link";
import { LegalList, LegalPage, LegalSection } from "@/components/legal/legal-page";
import { LEGAL, LEGAL_LINKS } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms of Use · Pace",
  description: "The terms for using Pace, including subscriptions, health information and AI features.",
  alternates: { canonical: LEGAL_LINKS.terms },
};

export default function TermsPage() {
  const mail = (
    <a className="underline underline-offset-4" href={`mailto:${LEGAL.contactEmail}`}>
      {LEGAL.contactEmail}
    </a>
  );

  return (
    <LegalPage eyebrow="Pace · Terms" title="Terms of Use" updated={LEGAL.termsUpdated}>
      <p>
        These terms are an agreement between you and {LEGAL.operator} (&ldquo;we&rdquo;,
        &ldquo;us&rdquo;), who runs Pace. By creating an account or using Pace you agree to them and to
        our{" "}
        <Link className="underline underline-offset-4" href={LEGAL_LINKS.privacy}>
          Privacy Policy
        </Link>
        . If you do not agree, please do not use Pace.
      </p>

      <LegalSection id="health" title="1. Pace is not medical advice">
        <p>
          Pace is a food diary and general wellness tool. Its calorie and nutrient targets, meal
          estimates, recipes, workouts and coach replies are general information based on standard
          formulas and AI. They are not medical, dietetic or psychological advice, and Pace does not
          diagnose, treat or prevent any condition.
        </p>
        <LegalList>
          <li>Talk to a doctor or registered dietitian before changing your diet or exercise, especially if you have a medical condition, take medication, or are pregnant or breastfeeding.</li>
          <li>Pace is not suitable for anyone with, or recovering from, an eating disorder. If food or weight is causing you distress, please contact your GP or an eating disorder charity such as Beat (beateatingdisorders.org.uk).</li>
          <li>Stop and seek medical help if you feel faint, dizzy, unwell or unusually tired.</li>
          <li>In an emergency, call your local emergency number.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="2. Who can use Pace">
        <p>
          You must be at least {LEGAL.minimumAge} years old. You are responsible for keeping your login
          details safe and for what happens on your account. Please give accurate details, as your targets
          depend on them.
        </p>
      </LegalSection>

      <LegalSection id="ai" title="3. AI features">
        <p>
          Meal photo estimates and the coach use artificial intelligence provided by OpenAI. AI output
          can be inaccurate or incomplete, for example in portion sizes, hidden ingredients or allergens.
          Check every estimate before you save it and never rely on Pace to identify allergens. We only
          send your photos and messages to the AI provider after you allow it, as the Privacy Policy
          explains.
        </p>
      </LegalSection>

      <LegalSection id="subscriptions" title="4. Premium subscriptions">
        <LegalList>
          <li>Pace has a free tier and an optional paid subscription (Premium). The price, billing period and any free trial are shown before you confirm a purchase.</li>
          <li>Payment is taken by Apple (App Store) or Google (Google Play) when you confirm, or when your free trial ends.</li>
          <li>Subscriptions renew automatically at the same price and period unless you turn off auto-renew at least 24 hours before the end of the current period. Your account is charged for renewal within 24 hours before the period ends.</li>
          <li>You can manage or cancel your subscription in your App Store or Google Play account settings. Deleting the app or your Pace account does not cancel it.</li>
          <li>If you cancel during a free trial you will not be charged. Any unused part of a free trial ends when you buy a subscription.</li>
          <li>Refunds are handled by Apple or Google under their policies. This does not affect your statutory rights.</li>
          <li>If we change the price we will give you notice, and you can cancel before the new price applies.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="5. Your content">
        <p>
          You own the photos, notes and messages you add. You give us permission to store and process
          them only to run Pace for you, as the Privacy Policy describes. Please do not upload anything
          illegal, harmful or that you do not have the right to share.
        </p>
      </LegalSection>

      <LegalSection title="6. Acceptable use">
        <p>
          Do not misuse Pace, including by trying to break its security, overload it, scrape it, reverse
          engineer it except where the law allows, or use it to harm others. We may suspend accounts that
          do.
        </p>
      </LegalSection>

      <LegalSection title="7. Changes and availability">
        <p>
          We are always improving Pace and may add, change or remove features. We try to keep Pace running
          but cannot promise it will always be available or error free. We will tell you in the app
          before making changes to these terms that affect you, and continuing to use Pace after that
          means you accept them.
        </p>
      </LegalSection>

      <LegalSection title="8. Ending your account">
        <p>
          You can stop using Pace and delete your account at any time from Settings. We may suspend or
          close accounts that break these terms, and will tell you why unless the law prevents it.
        </p>
      </LegalSection>

      <LegalSection title="9. Our responsibility to you">
        <p>
          Nothing in these terms limits liability for death or personal injury caused by negligence, for
          fraud, or anything else the law does not allow us to limit, and nothing affects your statutory
          consumer rights. Otherwise, because Pace provides general information and you remain in control
          of your own diet and exercise, we are not responsible for losses that were not foreseeable, or
          for decisions you make based on Pace&rsquo;s estimates or suggestions. Our total liability to you
          is limited to the amount you paid for Pace in the 12 months before the claim.
        </p>
      </LegalSection>

      <LegalSection id="app-store" title="10. If you downloaded Pace from the App Store">
        <p>
          These terms are between you and us, not Apple. Apple&rsquo;s{" "}
          <a
            className="underline underline-offset-4"
            href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"
          >
            Standard Licensed Application End User License Agreement
          </a>{" "}
          also applies. Apple has no obligation to provide maintenance or support for Pace, and is not
          responsible for any product claims, including product liability, legal or regulatory
          compliance, or intellectual property claims. If Pace fails to meet any applicable warranty you
          may notify Apple, which may refund the purchase price; Apple has no other warranty obligation
          to the extent the law allows. Apple and its subsidiaries are third-party beneficiaries of these
          terms and may enforce them against you.
        </p>
      </LegalSection>

      <LegalSection title="11. Law and contact">
        <p>
          These terms are governed by the laws of {LEGAL.governingLaw}. If you live elsewhere in the UK or
          in the EU, you keep the protection of the mandatory consumer laws where you live and can bring
          claims in your local courts. Questions or complaints: {mail}.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
