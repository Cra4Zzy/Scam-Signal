import type { Metadata } from 'next'
import LegalShell from '@/components/legal/LegalShell'

export const metadata: Metadata = { title: 'Impressum' }

export default function Page(){
  return <LegalShell
    title="Impressum"
    intro="Anbieterkennzeichnung und zentrale Kontaktinformationen für ScamSignal."
    eyebrow="ANBIETER · KONTAKT · TRANSPARENZ"
    notice="Dieses Impressum ist strukturell vorbereitet, aber noch nicht veröffentlichungsreif, solange die markierten Betreiberangaben fehlen. Vor breiter Bewerbung der Plattform müssen Name, ladungsfähige Anschrift und Kontakt vollständig eingesetzt werden."
  >
    <h2>Angaben gemäß § 5 DDG</h2>
    <div className="legal-placeholder"><strong>NOCH EINTRAGEN:</strong><br/>[Vollständiger Name / Unternehmensname]<br/>[Rechtsform, falls vorhanden]<br/>[ladungsfähige Anschrift – kein reines Postfach]<br/>[PLZ Ort]<br/>Deutschland</div>

    <h2>Kontakt</h2>
    <div className="legal-placeholder">E-Mail: [zentrale Kontaktadresse]<br/>Telefon: [falls geschäftlich vorgesehen]</div>

    <h2>Vertretungsberechtigung und Register</h2>
    <p>Falls der Betreiber eine juristische Person, Personengesellschaft oder ein eingetragenes Unternehmen ist, sind hier die gesetzlich erforderlichen Vertretungs- und Registerangaben zu ergänzen.</p>
    <div className="legal-placeholder">[Vertretungsberechtigte Person, falls erforderlich]<br/>[Registergericht / Registernummer, falls vorhanden]<br/>[USt-IdNr., falls vorhanden und anzugeben]</div>

    <h2>Kontaktstelle für Plattform- und Inhaltsmeldungen</h2>
    <p>Für Hinweise zu möglicherweise rechtswidrigen Inhalten, Datenschutzproblemen oder sonstigen dringenden Plattformangelegenheiten kann die nachfolgende Kontaktstelle verwendet werden. Soweit die Regelungen des Digital Services Act (DSA) auf ScamSignal Anwendung finden, dient diese Kontaktstelle zugleich als zentraler Kommunikationsweg im Rahmen der gesetzlichen Vorgaben.</p>
    <div className="legal-placeholder">E-Mail für Inhalts-/Rechtsmeldungen: [legal@scam-signal.com oder andere eingerichtete Adresse]<br/>Kommunikationssprache: Deutsch / Englisch</div>

    <h2>Verantwortlich für eigene redaktionelle Inhalte</h2>
    <p>Soweit ScamSignal eigene journalistisch-redaktionell gestaltete Inhalte anbietet und hierfür eine verantwortliche Person gesetzlich zu benennen ist, sind deren vollständige Angaben hier zu ergänzen. Nutzergenerierte Beiträge stammen dagegen von den jeweils angegebenen Nutzern und werden nach den Plattformregeln moderiert.</p>
    <div className="legal-placeholder">[Name und Anschrift der verantwortlichen Person, falls erforderlich]</div>

    <h2>Hinweis zu Nutzerbeiträgen</h2>
    <p>ScamSignal stellt eine technische Plattform für nutzergenerierte Meldungen und Diskussionen bereit. Nutzerbeiträge spiegeln nicht automatisch die Meinung des Plattformbetreibers wider. Eine Veröffentlichung oder Statuskennzeichnung auf ScamSignal ist keine behördliche oder gerichtliche Feststellung.</p>

    <h2>Verbraucherstreitbeilegung</h2>
    <p>Ob und welche Informationspflichten nach dem Verbraucherstreitbeilegungsgesetz bestehen, hängt von der konkreten Betreiberstruktur und Geschäftstätigkeit ab. Die zutreffende Erklärung ist vor dem kommerziellen Betrieb zu ergänzen.</p>
    <div className="legal-placeholder">[Falls anwendbar: Erklärung zur Bereitschaft/Verpflichtung zur Teilnahme an einem Streitbeilegungsverfahren ergänzen.]</div>
  </LegalShell>
}
