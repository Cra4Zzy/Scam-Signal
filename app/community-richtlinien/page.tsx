import type { Metadata } from 'next'
import LegalShell from '@/components/legal/LegalShell'

export const metadata: Metadata = { title: 'Community-Richtlinien' }

export default function Page(){
  return <LegalShell
    title="Community-Richtlinien"
    intro="ScamSignal soll Menschen warnen, ohne unbelegte Vorverurteilungen zu fördern. Diese Regeln bestimmen, welche Inhalte veröffentlicht werden dürfen, wie wir Belege behandeln und wie Moderation und Widerspruch funktionieren."
    eyebrow="COMMUNITY · MODERATION · FAIRNESS"
  >
    <div className="legal-intro"><strong>Kurz gesagt:</strong> Dokumentiere konkrete Vorgänge, trenne Tatsachen von Vermutungen, veröffentliche nur notwendige Daten und bleibe sachlich. Ein Verdacht darf benannt werden — aber nicht als erwiesene Tatsache dargestellt werden, wenn die Belege das nicht tragen.</div>

    <h2>1. Belege vor Behauptungen</h2>
    <p>Beschreibe möglichst konkret, <strong>was du selbst erlebt oder überprüft hast</strong>. Gib Zeiträume, Kommunikationswege, Zahlungsabläufe, Domains, Wallets oder andere relevante Indikatoren an, soweit dies rechtlich zulässig und für den Fall erforderlich ist.</p>
    <p>Unterscheide klar zwischen eigener Wahrnehmung, Schlussfolgerungen und Informationen Dritter. Formulierungen wie „nach meiner Erfahrung“, „Verdacht“, „Hinweis“ oder „nicht verifiziert“ sind zu verwenden, wenn ein Sachverhalt nicht abschließend geklärt ist.</p>

    <h2>2. Keine erfundenen, manipulierten oder irreführenden Belege</h2>
    <p>Verboten sind bewusst falsche Tatsachenbehauptungen, manipulierte Screenshots, gefälschte Zahlungsbelege, aus dem Zusammenhang gerissene Inhalte und sonstige Täuschungen. Wer Belege verändert, muss kenntlich machen, was aus Datenschutz- oder Sicherheitsgründen geschwärzt wurde.</p>

    <h2>3. Personenbezogene Daten nur, wenn sie wirklich erforderlich sind</h2>
    <p>Veröffentliche keine privaten Wohnadressen, Ausweisnummern, vollständigen Bank- oder Kartendaten, Passwörter, Seed Phrases, private Schlüssel, Zugangscodes, Gesundheitsdaten oder sonstige hochsensible Informationen.</p>
    <p>Bei Screenshots sollen unnötige Namen, E-Mail-Adressen, Telefonnummern, Profilbilder, Kundennummern und andere personenbezogene Daten geschwärzt werden. Minderjährige Personen dürfen nicht identifizierbar dargestellt werden, sofern dies nicht zwingend erforderlich und rechtlich zulässig ist.</p>

    <h2>4. Unternehmen, Domains und Accounts dürfen sachlich benannt werden</h2>
    <p>Die Benennung eines Unternehmens, einer Domain, Wallet-Adresse, Telefonnummer oder eines öffentlichen Accounts kann für die Warnfunktion der Plattform erforderlich sein. Sie muss sich auf den dokumentierten Sachverhalt beziehen und darf nicht mit Beleidigungen, Schmähungen oder unbelegten Tatsachenbehauptungen verbunden werden.</p>

    <h2>5. Keine Selbstjustiz, Drohungen oder Belästigung</h2>
    <div className="legal-rule-grid">
      <div className="legal-rule"><b>Kein Doxxing</b><p>Keine Veröffentlichung privater Daten mit dem Ziel, eine Person gezielt bloßzustellen oder angreifbar zu machen.</p></div>
      <div className="legal-rule"><b>Keine Drohungen</b><p>Keine Gewaltandrohungen, Einschüchterungen oder Aufrufe zu Vergeltungsmaßnahmen.</p></div>
      <div className="legal-rule"><b>Keine Angriffe</b><p>Keine Aufforderungen zum Hacken, Überlasten, Phishing oder sonstigen rechtswidrigen Zugriffen.</p></div>
      <div className="legal-rule"><b>Keine Kampagnen</b><p>Keine koordinierte Belästigung, massenhaften Falschmeldungen oder gezielte Rufschädigung.</p></div>
    </div>

    <h2>6. Widerspruch und Gegenbelege gehören zum System</h2>
    <p>Andere Nutzer dürfen Aussagen hinterfragen, Gegenbelege liefern und auf Fehler hinweisen. Auch betroffene Unternehmen oder Personen dürfen sachlich widersprechen und eine Überprüfung verlangen. Kritik an einem Beitrag ist kein Regelverstoß, solange sie sachlich bleibt.</p>

    <h2>7. Unsere Statusangaben sind keine Gerichtsentscheidung</h2>
    <p>ScamSignal kann Fälle beispielsweise als <strong>gemeldet, in Prüfung, gestützt, bestritten, bestätigt oder geschlossen</strong> kennzeichnen. Diese Statusangaben beschreiben ausschließlich den auf der Plattform dokumentierten Prüf- und Evidenzstand.</p>
    <div className="legal-callout"><strong>Wichtig</strong><p>Eine Kennzeichnung auf ScamSignal ersetzt weder eine behördliche Bewertung noch eine gerichtliche Feststellung. Neue Belege oder ein berechtigter Widerspruch können den Status jederzeit verändern.</p></div>

    <h2>8. Inhalte melden: Notice-and-Action</h2>
    <p>Jeder Fall, Kommentar und jedes Profil kann über die Meldefunktion gemeldet werden. Geeignete Gründe sind insbesondere möglicherweise rechtswidrige Inhalte, personenbezogene Daten, Belästigung, Identitätsvortäuschung, Spam oder möglicherweise falsche Tatsachenbehauptungen.</p>
    <p>Eine Meldung sollte möglichst konkret erklären, welcher Inhalt beanstandet wird und warum. Soweit erforderlich prüfen wir gemeldete Inhalte und können sie vorübergehend einschränken, ergänzend kennzeichnen oder entfernen.</p>

    <h2>9. Moderationsmaßnahmen</h2>
    <p>Je nach Schwere, Eindeutigkeit und Wiederholung eines Verstoßes können wir Inhalte kennzeichnen, in der Sichtbarkeit einschränken, sperren oder entfernen. Bei wiederholten oder schweren Verstößen können Accounts vorübergehend oder dauerhaft eingeschränkt werden.</p>
    <p>Moderationsentscheidungen sollen so weit wie angemessen nachvollziehbar sein. Bei rechtlich sensiblen Fällen können wir zusätzliche Informationen oder Belege anfordern, bevor wir eine endgültige Entscheidung treffen.</p>

    <h2>10. Widerspruch gegen Moderation</h2>
    <p>Wenn dein Inhalt eingeschränkt oder entfernt wurde, kannst du eine erneute Prüfung verlangen. Gib dabei die betroffene Meldung oder Entscheidung an und erläutere, warum sie aus deiner Sicht geändert werden sollte. Auch Betroffene können eine Überprüfung beanstandeter Inhalte verlangen.</p>

    <h2>11. Sichere Links und Indikatoren</h2>
    <p>Verdächtige URLs dienen auf ScamSignal als Hinweise. Die Aufnahme einer URL bedeutet nicht automatisch, dass die betreffende Website tatsächlich betrügerisch oder rechtswidrig ist. Öffne verdächtige Links nicht ungeschützt und gib dort keine Zugangsdaten ein.</p>

    <h2>12. Was wir von der Community erwarten</h2>
    <ul>
      <li>Respektiere andere Nutzer, auch wenn du ihre Einschätzung nicht teilst.</li>
      <li>Korrigiere eigene Beiträge, wenn neue Informationen deine ursprüngliche Darstellung widerlegen.</li>
      <li>Nutze Votes nicht als Ersatz für Beweise.</li>
      <li>Melde Regelverstöße über die Meldefunktion statt öffentliche Eskalationen zu starten.</li>
      <li>Veröffentliche nur Inhalte, die du rechtmäßig teilen darfst.</li>
    </ul>

    <h2>13. Änderungen dieser Richtlinien</h2>
    <p>Wir können die Community-Richtlinien weiterentwickeln, wenn neue Missbrauchsmuster, rechtliche Anforderungen oder Funktionen dies erforderlich machen. Wesentliche Änderungen werden mit einem aktualisierten Stand kenntlich gemacht.</p>
  </LegalShell>
}
