import Image from 'next/image'
import Link from 'next/link'

export default function Footer(){
  return <footer className="footer site-footer">
    <div className="site-footer-inner">
      <div className="footer-top">
        <div className="footer-brand">
          <Image src="/scam-signal-logo.svg" alt="ScamSignal" width={190} height={50}/>
          <h2>Hinweise sichtbar machen. Behauptungen prüfbar halten.</h2>
          <p>ScamSignal ist eine Community-Plattform für dokumentierte Scam-Verdachtsfälle. Beiträge werden nicht allein durch ihre Veröffentlichung zu bestätigten Tatsachen.</p>
        </div>
        <div className="footer-nav-grid">
          <div className="footer-col"><b>Plattform</b><Link href="/">Feed</Link><Link href="/#categories">Kategorien</Link><Link href="/community-richtlinien">Community-Richtlinien</Link></div>
          <div className="footer-col"><b>Rechtliches</b><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link><Link href="/nutzungsbedingungen">Nutzungsbedingungen</Link></div>
        </div>
      </div>
      <div className="footer-bottom"><span>© 2026 ScamSignal</span><span>Nutzerbeiträge sind Community-Meldungen. Statusangaben bilden den Prüfstand auf ScamSignal ab und ersetzen keine behördliche oder gerichtliche Feststellung.</span></div>
    </div>
  </footer>
}
