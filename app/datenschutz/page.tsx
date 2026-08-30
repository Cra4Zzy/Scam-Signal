import type { Metadata } from 'next'
import LegalShell from '@/components/legal/LegalShell'

export const metadata: Metadata = { title: 'Datenschutzerklärung' }

export default function Page(){
  return <LegalShell
    title="Datenschutzerklärung"
    intro="Hier erklären wir, welche personenbezogenen Daten bei der Nutzung von ScamSignal verarbeitet werden, zu welchen Zwecken dies geschieht und welche Rechte betroffene Personen haben."
    eyebrow="DATENSCHUTZ · DSGVO · TRANSPARENZ"
    notice="Wichtig vor dem breiten öffentlichen Launch: Die Betreiber- und Kontaktangaben in Abschnitt 1 müssen mit den tatsächlichen Angaben des Verantwortlichen vervollständigt werden. Bei Änderungen am Stack – etwa Analytics, CAPTCHA, neuem SMTP-Anbieter oder Werbung – ist diese Erklärung entsprechend anzupassen."
  >
    <h2>1. Verantwortlicher</h2>
    <p>Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:</p>
    <div className="legal-placeholder"><strong>NOCH EINTRAGEN:</strong><br/>[Vollständiger Name / Unternehmensname]<br/>[ladungsfähige Anschrift]<br/>Deutschland<br/><br/>E-Mail: [Datenschutz-/Kontaktadresse]<br/>Telefon: [falls vorgesehen]</div>
    <p>Sofern ein Datenschutzbeauftragter bestellt werden muss oder freiwillig bestellt wird, werden dessen Kontaktdaten an dieser Stelle ergänzt.</p>

    <h2>2. Wofür ScamSignal Daten verarbeitet</h2>
    <p>ScamSignal ist eine Community-Plattform zur Dokumentation, Diskussion und Moderation von Scam-Verdachtsfällen. Personenbezogene Daten werden insbesondere verarbeitet, um Accounts bereitzustellen, Beiträge und Kommentare zu veröffentlichen, Community-Funktionen zu ermöglichen, Belege zu speichern, Inhalte zu moderieren, Missbrauch abzuwehren und die technische Sicherheit der Plattform zu gewährleisten.</p>

    <h2>3. Hosting und technische Auslieferung über Vercel</h2>
    <p>Die Website wird über <strong>Vercel</strong> bereitgestellt. Beim Aufruf der Website können technisch erforderliche Verbindungsdaten verarbeitet werden, insbesondere IP-Adresse, Zeitpunkt des Zugriffs, aufgerufene URL, Referrer, Browser-/Geräteinformationen sowie technische Fehler- und Sicherheitsdaten.</p>
    <p>Die Verarbeitung erfolgt zur sicheren, stabilen und performanten Bereitstellung der Website sowie zur Abwehr von Angriffen und Fehleranalyse. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in einem sicheren und zuverlässigen Betrieb der Plattform.</p>

    <h2>4. Datenbank, Authentifizierung und Dateispeicher über Supabase</h2>
    <p>Für Datenbank, Benutzer-Authentifizierung und den geschützten Dateispeicher nutzt ScamSignal <strong>Supabase</strong>. Das produktive Projekt ist derzeit in der Region Frankfurt konfiguriert. Dabei können insbesondere Accountdaten, Profilinformationen, Beiträge, Kommentare, Votes, Meldungen, Moderationsdaten und hochgeladene Belege verarbeitet werden.</p>
    <p>Je nach Funktion erfolgt die Verarbeitung zur Vertragserfüllung bzw. Bereitstellung des Nutzerkontos und der Community-Funktionen gemäß Art. 6 Abs. 1 lit. b DSGVO sowie zur Sicherheit, Missbrauchsprävention und Moderation auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.</p>

    <h2>5. Registrierung und Nutzerkonto</h2>
    <p>Bei der Registrierung verarbeiten wir insbesondere:</p>
    <ul><li>E-Mail-Adresse</li><li>Nutzername und freiwillige Profilangaben</li><li>technische Authentifizierungs- und Sitzungsdaten</li><li>Zeitpunkte sicherheitsrelevanter Account-Vorgänge</li></ul>
    <p>Die E-Mail-Adresse wird nicht als öffentliches Profilfeld angezeigt. Für die Anmeldung werden technisch notwendige Sitzungsinformationen verarbeitet.</p>

    <h2>6. Öffentliche Beiträge, Kommentare und Profilinformationen</h2>
    <p>Inhalte, die Nutzer bewusst als öffentliche Meldung, Kommentar oder öffentliches Profilmerkmal veröffentlichen, sind für andere Besucher abrufbar. Öffentliche Inhalte können dadurch auch von Suchmaschinen erfasst und in deren Zwischenspeichern oder Suchergebnissen verarbeitet werden.</p>
    <div className="legal-callout"><strong>Bitte keine unnötigen personenbezogenen Daten veröffentlichen.</strong><p>ScamSignal ist eine öffentliche Plattform. Schwärze in Screenshots und Belegen alle Informationen, die für die Dokumentation des Falls nicht erforderlich sind.</p></div>

    <h2>7. Hochgeladene Belege und Screenshots</h2>
    <p>Hochgeladene Belege werden in einem privaten Storage-Bereich gespeichert und nicht über einen dauerhaft öffentlichen Storage-Link bereitgestellt. Die Anwendung verarbeitet Bilddateien serverseitig und kann sie technisch neu encodieren, um Metadaten zu reduzieren und ein einheitliches Dateiformat bereitzustellen.</p>
    <p>Nutzer sollen ausschließlich Inhalte hochladen, die sie rechtmäßig übermitteln dürfen. Personenbezogene Daten Dritter sind auf das für die Dokumentation erforderliche Maß zu reduzieren.</p>

    <h2>8. Indikatoren wie Domains, Wallets, Telefonnummern und Accounts</h2>
    <p>ScamSignal kann strukturierte Indikatoren speichern, beispielsweise Domains, URLs, Wallet-Adressen, Telefonnummern, E-Mail-Adressen, öffentliche Social-Media-Accounts oder Nutzernamen. Je nach Art des Indikators kann es sich um personenbezogene Daten handeln.</p>
    <p>Die Verarbeitung dient der strukturierten Dokumentation und Auffindbarkeit von Scam-Verdachtsfällen. Rechtsgrundlage ist, soweit keine speziellere Rechtsgrundlage greift, Art. 6 Abs. 1 lit. f DSGVO. Dabei werden die Interessen der betroffenen Personen gegen das Interesse an einer nachvollziehbaren Warn- und Dokumentationsfunktion abgewogen.</p>

    <h2>9. Votes, gespeicherte Fälle und Abonnements</h2>
    <p>Bei angemeldeten Nutzern können Interaktionen wie Votes, gespeicherte Fälle oder Fall-Abonnements dem Nutzerkonto zugeordnet werden. Diese Daten werden benötigt, um die jeweilige Funktion bereitzustellen und Mehrfachaktionen korrekt zu behandeln. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.</p>

    <h2>10. Inhaltsmeldungen, Moderation und Widersprüche</h2>
    <p>Wenn Inhalte gemeldet oder Moderationsentscheidungen getroffen werden, verarbeiten wir die hierfür erforderlichen Daten, zum Beispiel meldende Person, betroffenen Inhalt, Meldegrund, Erläuterungen, Moderationsstatus und interne Bearbeitungsinformationen.</p>
    <p>Die Verarbeitung erfolgt zur Durchsetzung unserer Community-Regeln, zur Bearbeitung möglicherweise rechtswidriger Inhalte, zum Schutz der Community und zur Erfüllung gesetzlicher Pflichten. Rechtsgrundlagen können Art. 6 Abs. 1 lit. c und lit. f DSGVO sein.</p>

    <h2>11. Sicherheits- und Protokolldaten</h2>
    <p>Zum Schutz vor Spam, automatisiertem Missbrauch, Account-Übernahmen und technischen Angriffen können Sicherheits- und Protokolldaten verarbeitet werden. Dazu gehören je nach Dienst insbesondere IP-Adresse, Zeitstempel, technische Anfrageinformationen, Authentifizierungsereignisse und Fehlermeldungen.</p>
    <p>Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse besteht in der Sicherstellung von Vertraulichkeit, Integrität und Verfügbarkeit der Plattform.</p>

    <h2>12. Cookies und lokale Speicherung</h2>
    <p>ScamSignal verwendet derzeit keine Werbe- oder Marketing-Tracker. Für Login und Sitzungsverwaltung können technisch notwendige Cookies bzw. vergleichbare Speichermechanismen eingesetzt werden. Diese sind erforderlich, damit angemeldete Nutzer sicher authentifiziert bleiben und geschützte Funktionen nutzen können.</p>
    <p>Sollten zukünftig nicht notwendige Analyse-, Marketing- oder Drittanbieter-Technologien eingesetzt werden, wird diese Datenschutzerklärung angepasst und – soweit erforderlich – eine vorherige Einwilligung eingeholt.</p>

    <h2>13. E-Mail-Kommunikation</h2>
    <p>Für Registrierung, Bestätigung, Passwort-Wiederherstellung oder sicherheitsrelevante Account-Kommunikation können transaktionale E-Mails versendet werden. Der hierfür tatsächlich eingesetzte SMTP-/E-Mail-Dienstleister ist vor Aktivierung eines produktiven E-Mail-Versands in dieser Erklärung zu ergänzen.</p>
    <div className="legal-placeholder"><strong>VOR AKTIVIERUNG VON CUSTOM SMTP ERGÄNZEN:</strong><br/>[Name des E-Mail-Dienstleisters, Sitz, Zweck, Datenschutzhinweise / Drittlandtransfer falls relevant]</div>

    <h2>14. Empfänger und Auftragsverarbeiter</h2>
    <p>Personenbezogene Daten werden nur an Dienstleister übermittelt, soweit dies für Betrieb, Hosting, Authentifizierung, Speicherung, Sicherheit oder Kommunikation erforderlich ist. Aktuell zählen hierzu insbesondere Vercel und Supabase. Soweit Dienstleister als Auftragsverarbeiter tätig werden, erfolgt die Einbindung auf Grundlage der gesetzlichen Anforderungen an die Auftragsverarbeitung.</p>

    <h2>15. Verarbeitung außerhalb des Europäischen Wirtschaftsraums</h2>
    <p>Auch bei einer europäischen Infrastrukturregion können Anbieter oder deren Unterauftragnehmer in Einzelfällen außerhalb des Europäischen Wirtschaftsraums tätig sein, etwa für Support, Sicherheitsleistungen oder konzerninterne Verarbeitung. Soweit hierfür ein Drittlandtransfer im Sinne der DSGVO vorliegt, werden die gesetzlich vorgesehenen Übermittlungsmechanismen und Schutzmaßnahmen des jeweiligen Dienstleisters berücksichtigt.</p>

    <h2>16. Speicherdauer</h2>
    <p>Wir speichern personenbezogene Daten nur so lange, wie sie für den jeweiligen Zweck erforderlich sind oder gesetzliche Aufbewahrungs-, Nachweis- oder Verteidigungsinteressen bestehen.</p>
    <ul><li><strong>Accountdaten:</strong> grundsätzlich für die Dauer des Nutzerkontos und darüber hinaus nur, soweit rechtliche oder sicherheitsbezogene Gründe dies erfordern.</li><li><strong>Öffentliche Community-Inhalte:</strong> solange sie für die Dokumentation und Diskussion des Falls erforderlich sind oder bis eine Löschung bzw. Einschränkung nach Prüfung verlangt oder veranlasst wird.</li><li><strong>Moderations- und Meldedaten:</strong> solange dies zur Bearbeitung, Missbrauchsprävention und Dokumentation von Entscheidungen erforderlich ist.</li><li><strong>Technische Logs:</strong> nach den für Sicherheit und Betrieb erforderlichen Fristen der eingesetzten Systeme und Dienstleister.</li></ul>
    <p>Statt einer Löschung kann im Einzelfall eine Anonymisierung in Betracht kommen, wenn der Zweck ohne Personenbezug weiterhin erfüllt werden kann.</p>

    <h2>17. Rechtsgrundlagen im Überblick</h2>
    <ul><li><strong>Art. 6 Abs. 1 lit. b DSGVO:</strong> Bereitstellung von Account- und Community-Funktionen auf Nutzeranfrage.</li><li><strong>Art. 6 Abs. 1 lit. c DSGVO:</strong> Erfüllung gesetzlicher Verpflichtungen, soweit einschlägig.</li><li><strong>Art. 6 Abs. 1 lit. f DSGVO:</strong> sicherer Plattformbetrieb, Missbrauchsprävention, Moderation, Schutz vor Angriffen und nachvollziehbare Dokumentation.</li><li><strong>Art. 6 Abs. 1 lit. a DSGVO:</strong> Einwilligung, falls zukünftig Funktionen eingesetzt werden, die eine Einwilligung erfordern.</li></ul>

    <h2>18. Rechte betroffener Personen</h2>
    <p>Betroffene Personen haben nach Maßgabe der gesetzlichen Voraussetzungen insbesondere das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen. Erteilte Einwilligungen können mit Wirkung für die Zukunft widerrufen werden.</p>
    <p>Anfragen können an die in Abschnitt 1 genannte Kontaktadresse gerichtet werden. Zur Vermeidung unbefugter Datenzugriffe kann bei Anfragen ein geeigneter Nachweis der Identität erforderlich sein.</p>

    <h2>19. Beschwerderecht</h2>
    <p>Betroffene Personen haben das Recht, sich bei einer zuständigen Datenschutzaufsichtsbehörde zu beschweren. Die Zuständigkeit richtet sich insbesondere nach dem Sitz des Verantwortlichen und den gesetzlichen Zuständigkeitsregeln.</p>

    <h2>20. Schutz personenbezogener Daten</h2>
    <p>Wir setzen technische und organisatorische Maßnahmen ein, um Daten gegen Verlust, unbefugten Zugriff und Manipulation zu schützen. Dazu gehören unter anderem verschlüsselte HTTPS-Verbindungen, rollenbasierte Zugriffsregeln, Row Level Security in der Datenbank, private Dateispeicher und serverseitige Prüfungen bei sensiblen Upload- und Schreibvorgängen.</p>

    <h2>21. Änderungen dieser Datenschutzerklärung</h2>
    <p>Diese Erklärung wird angepasst, wenn sich Funktionen, Dienstleister, Rechtslage oder Datenverarbeitungen wesentlich ändern. Maßgeblich ist die jeweils auf ScamSignal veröffentlichte Fassung mit dem angegebenen Stand.</p>
  </LegalShell>
}
