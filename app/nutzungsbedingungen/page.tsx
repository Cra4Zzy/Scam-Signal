import type { Metadata } from 'next'
import LegalShell from '@/components/legal/LegalShell'

export const metadata: Metadata = { title: 'Nutzungsbedingungen' }

export default function Page(){
  return <LegalShell
    title="Nutzungsbedingungen"
    intro="Diese Bedingungen regeln die Nutzung von ScamSignal als öffentliche Community-Plattform zur Dokumentation und Diskussion von Scam-Verdachtsfällen."
    eyebrow="PLATTFORM · NUTZUNG · VERANTWORTUNG"
    notice="Die Betreiberangaben im Impressum müssen vor dem breiten öffentlichen Launch vollständig sein. Diese Nutzungsbedingungen sind auf den derzeitigen Funktionsumfang von ScamSignal abgestimmt und sollten bei wesentlichen Produktänderungen erneut geprüft werden."
  >
    <h2>1. Gegenstand der Plattform</h2>
    <p>ScamSignal ermöglicht Nutzern, eigene Erfahrungen und Hinweise zu möglichen Betrugs- oder Täuschungssachverhalten zu dokumentieren, zu kommentieren und durch strukturierte Indikatoren oder Belege zu ergänzen.</p>
    <p>ScamSignal ist weder Behörde noch Gericht noch Ermittlungsdienst. Nutzerbeiträge und Plattformstatus sind keine verbindliche Feststellung darüber, ob eine Person oder ein Unternehmen tatsächlich rechtswidrig oder betrügerisch gehandelt hat.</p>

    <h2>2. Geltung dieser Bedingungen</h2>
    <p>Mit der Erstellung eines Accounts und der Nutzung registrierungspflichtiger Funktionen akzeptiert der Nutzer diese Nutzungsbedingungen und die Community-Richtlinien. Die Community-Richtlinien sind Bestandteil der Regeln für nutzergenerierte Inhalte.</p>

    <h2>3. Nutzerkonto</h2>
    <p>Bei der Registrierung müssen zutreffende und funktionsfähige Zugangsdaten verwendet werden. Zugangsdaten sind geheim zu halten und dürfen nicht mit anderen Personen geteilt werden. Nutzer sind verpflichtet, uns bei einem vermuteten unbefugten Zugriff auf ihr Konto möglichst schnell zu informieren.</p>
    <p>Wir können technische und organisatorische Maßnahmen einsetzen, um automatisierte Registrierungen, Account-Missbrauch und Manipulationen zu begrenzen.</p>

    <h2>4. Verantwortung für eigene Inhalte</h2>
    <p>Nutzer sind für die von ihnen eingestellten Inhalte verantwortlich. Sie dürfen nur Inhalte veröffentlichen, die sie rechtmäßig veröffentlichen dürfen und die nicht gegen Gesetze, Rechte Dritter oder unsere Community-Richtlinien verstoßen.</p>
    <p>Insbesondere dürfen keine bewusst falschen Tatsachenbehauptungen, gefälschten Beweise, Drohungen, beleidigenden Schmähungen, rechtswidrig veröffentlichten personenbezogenen Daten oder Inhalte mit Aufrufen zu rechtswidrigen Angriffen eingestellt werden.</p>

    <h2>5. Verdachtsmeldungen müssen als solche erkennbar bleiben</h2>
    <p>Ist ein Sachverhalt nicht abschließend geklärt, darf er nicht ohne ausreichende Grundlage als feststehende Tatsache dargestellt werden. Nutzer sollen Beobachtungen, Vermutungen und Schlussfolgerungen voneinander trennen und Gegeninformationen berücksichtigen.</p>

    <h2>6. Nutzungsrechte an eingestellten Inhalten</h2>
    <p>Der Nutzer behält seine Rechte an eigenen Inhalten. Soweit dies für Betrieb und Darstellung der Plattform erforderlich ist, räumt er ScamSignal ein nicht ausschließliches, räumlich nicht beschränktes Recht ein, den Inhalt technisch zu speichern, zu vervielfältigen, für die Darstellung aufzubereiten und innerhalb der Plattform öffentlich zugänglich zu machen.</p>
    <p>Dieses Nutzungsrecht ist auf den Zweck des Plattformbetriebs, der Moderation, der Sicherung und der Darstellung des jeweiligen Inhalts beschränkt. Zwingende gesetzliche Rechte bleiben unberührt.</p>

    <h2>7. Moderation und Inhaltsprüfung</h2>
    <p>Wir dürfen Inhalte prüfen, kennzeichnen, in ihrer Sichtbarkeit einschränken, sperren oder entfernen, wenn konkrete Anhaltspunkte für einen Regelverstoß, eine Rechtsverletzung oder ein Sicherheitsrisiko bestehen. Bei wiederholten oder schweren Verstößen können Nutzerkonten eingeschränkt oder gesperrt werden.</p>
    <p>Die Entscheidung richtet sich nach dem konkreten Einzelfall, den vorliegenden Informationen, der Schwere des möglichen Verstoßes und den Rechten der Beteiligten.</p>

    <h2>8. Meldung möglicherweise rechtswidriger Inhalte</h2>
    <p>Über die Meldefunktion können Nutzer und Betroffene auf möglicherweise rechtswidrige oder regelwidrige Inhalte hinweisen. Meldungen sollen den beanstandeten Inhalt eindeutig bezeichnen und die Gründe so konkret wie möglich erläutern.</p>
    <p>Soweit gesetzlich erforderlich, bearbeiten wir hinreichend konkrete Meldungen nach den für den jeweiligen Dienst geltenden Vorgaben. Eine Meldung führt nicht automatisch zur Löschung des Inhalts.</p>

    <h2>9. Widerspruch und Gegenbelege</h2>
    <p>Betroffene Personen und Unternehmen sowie andere Nutzer können Gegeninformationen und Gegenbelege vorlegen oder eine erneute Überprüfung beantragen. ScamSignal soll ein nachvollziehbarer Dokumentationsraum sein, kein System, in dem eine einmal veröffentlichte Behauptung unangreifbar bleibt.</p>

    <h2>10. Votes, Reputation und Status</h2>
    <p>Votes, Reputationswerte und Community-Interaktionen sind Orientierungssignale. Sie stellen weder einen Beweis noch eine rechtliche Bewertung dar. Plattformstatus wie „gemeldet“, „gestützt“ oder „bestätigt“ beziehen sich auf den dokumentierten Evidenzstand innerhalb von ScamSignal.</p>

    <h2>11. Verdächtige Links und externe Inhalte</h2>
    <p>ScamSignal kann Links, Domains und andere externe Indikatoren dokumentieren. Wir machen uns externe Inhalte nicht allein durch Verlinkung zu eigen. Nutzer sollten verdächtige Links nicht ungeschützt öffnen und dort keine Zugangsdaten oder Zahlungsinformationen eingeben.</p>

    <h2>12. Verfügbarkeit und Weiterentwicklung</h2>
    <p>Wir bemühen uns um einen sicheren und stabilen Betrieb, schulden jedoch keine jederzeit unterbrechungsfreie Verfügbarkeit. Wartung, Sicherheitsmaßnahmen, technische Störungen oder Änderungen an Drittanbietern können die Plattform vorübergehend beeinträchtigen.</p>
    <p>Funktionen können weiterentwickelt, geändert oder eingestellt werden, soweit dies unter Berücksichtigung der Nutzerinteressen zumutbar ist.</p>

    <h2>13. Haftung</h2>
    <p>Für eigene Inhalte und Leistungen haftet ScamSignal nach den gesetzlichen Vorschriften. Für nutzergenerierte Inhalte gelten die gesetzlichen Verantwortlichkeitsregelungen für Plattformanbieter.</p>
    <p>Soweit gesetzlich zulässig, übernehmen wir keine Gewähr dafür, dass nutzergenerierte Inhalte vollständig, aktuell oder richtig sind. Dies schließt insbesondere die Behauptungen, Bewertungen und Schlussfolgerungen einzelner Nutzer ein.</p>
    <p>Haftungsbeschränkungen gelten nicht bei Vorsatz, grober Fahrlässigkeit, Verletzung von Leben, Körper oder Gesundheit oder in Fällen, in denen eine Haftung gesetzlich zwingend vorgeschrieben ist.</p>

    <h2>14. Sperrung und Beendigung</h2>
    <p>Nutzer können die weitere Nutzung ihres Kontos beenden. Bestehende öffentliche Inhalte können aus Gründen der Dokumentationsintegrität, rechtlicher Pflichten oder berechtigter Interessen nicht zwingend automatisch zusammen mit dem Account verschwinden; Löschungs- oder Anonymisierungsanfragen werden nach den gesetzlichen Vorgaben geprüft.</p>
    <p>Wir können Konten bei erheblichen oder wiederholten Verstößen gegen diese Bedingungen, die Community-Richtlinien oder gesetzliche Vorgaben sperren.</p>

    <h2>15. Änderungen der Bedingungen</h2>
    <p>Diese Bedingungen können geändert werden, wenn neue Funktionen, Missbrauchsrisiken oder rechtliche Anforderungen dies erforderlich machen. Wesentliche Änderungen werden in geeigneter Weise kenntlich gemacht. Für bereits begründete Rechtsverhältnisse gelten gesetzliche Informations- und Zustimmungserfordernisse.</p>

    <h2>16. Anwendbares Recht</h2>
    <p>Es gilt deutsches Recht unter Ausschluss solcher Regelungen, deren Anwendung zwingenden Verbraucherschutzvorschriften des gewöhnlichen Aufenthaltsstaates eines Verbrauchers entgegenstehen würde. Gesetzliche Gerichtsstände bleiben unberührt.</p>

    <h2>17. Kontakt</h2>
    <p>Fragen zu diesen Nutzungsbedingungen, Inhaltsmeldungen oder Moderationsentscheidungen können über die im Impressum genannte Kontaktmöglichkeit gestellt werden.</p>
  </LegalShell>
}
