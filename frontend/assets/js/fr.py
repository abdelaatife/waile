# -*- coding: utf-8 -*-
from fpdf import FPDF
import datetime

# Configuration PDF
class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 16)
        self.cell(0, 10, "Rapport d'Analyse Financière", 0, 1, 'C')
        self.set_font('Arial', 'I', 10)
        self.cell(0, 8, f"Date : {datetime.datetime.now().strftime('%d/%m/%Y')}", 0, 1, 'C')
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}/{{nb}}', 0, 0, 'C')

    def section_title(self, title):
        self.set_font('Arial', 'B', 12)
        self.set_fill_color(200, 220, 255)
        self.cell(0, 8, title, 0, 1, 'L', 1)
        self.ln(4)

    def ratio_analysis(self, ratio, interpretation, recommendation):
        self.set_font('Arial', 'B', 10)
        self.cell(0, 6, ratio, 0, 1)
        self.set_font('Arial', '', 10)
        self.multi_cell(0, 6, f"Interprétation : {interpretation}")
        self.multi_cell(0, 6, f"Recommandations : {recommendation}")
        self.ln(2)

# Création du PDF
pdf = PDF()
pdf.alias_nb_pages()
pdf.add_page()
pdf.set_font('Arial', '', 10)

# Section I
pdf.section_title('I. Équilibres Financiers Fondamentaux')

pdf.ratio_analysis(
    "Fonds de Roulement Net Global (FRNG) : 20 750 DZ",
    "Structure financière saine avec ressources stables suffisantes pour financer les immobilisations. Marge de sécurité financière significative.",
    "Maintenir cette gestion prudente et utiliser le surplus pour financer le BFR."
)

pdf.ratio_analysis(
    "Besoin en Fonds de Roulement (BFR) : -27 350 DZ",
    "Cycle d'exploitation excédentaire générant un surplus de trésorerie grâce à une rotation rapide et des conditions fournisseurs favorables.",
    "Optimiser les délais fournisseurs sans nuire aux relations commerciales. Surveiller les niveaux de stocks."
)

pdf.ratio_analysis(
    "Trésorerie Nette : 10 500 DZ",
    "Capacité excellente à faire face aux engagements à court terme avec une marge de manoeuvre confortable.",
    "Investir l'excédent à court terme ou l'utiliser pour des investissements futurs sans endettement."
)

# Section II
pdf.section_title('II. Performance Opérationnelle')

pdf.ratio_analysis(
    "Délai Clients : 16.66 jours | Délai Fournisseurs : 16 jours",
    "Recouvrement clients excellent mais délai fournisseurs trop court réduisant l'avantage du BFR négatif.",
    "Négocier l'allongement des délais fournisseurs pour améliorer la trésorerie tout en maintenant les relations."
)

pdf.ratio_analysis(
    "BFRE/CA : 1.05%",
    "Besoins opérationnels très faibles par rapport au chiffre d'affaires.",
    "Maintenir cette efficacité opérationnelle et viser un BFRE négatif si possible."
)

# Section III
pdf.section_title('III. Solvabilité et Structure Financière')

pdf.ratio_analysis(
    "Autonomie Financière : 67%",
    "Très faible dépendance aux créanciers avec une structure de financement robuste.",
    "Profiter de cette capacité d'endettement pour des investissements stratégiques."
)

pdf.ratio_analysis(
    "Couverture Dettes Financières : 84%",
    "Niveau d'endettement financier nécessitant une attention malgré l'autonomie globale satisfaisante.",
    "Analyser le coût de la dette et envisager une augmentation des capitaux propres."
)

# Section IV
pdf.section_title('IV. Analyse de Liquidité')

pdf.ratio_analysis(
    "Liquidité Générale : 2.277",
    "Capacité excellente à honorer les dettes court terme avec les actifs circulants.",
    "Poursuivre la gestion actuelle des actifs et passifs circulants."
)

pdf.ratio_analysis(
    "Liquidité Réduite : 0.057",
    "Dépendance critique à la rotation des stocks pour la liquidité immédiate.",
    "Optimiser la rotation des stocks et renforcer la gestion des créances clients."
)

# Section V
pdf.section_title('V. Performance de Rentabilité')

pdf.ratio_analysis(
    "ROA (Rentabilité Économique) : 25.6%",
    "Utilisation extrêmement efficace des actifs pour générer des profits.",
    "Maintenir l'optimisation des actifs et l'efficacité opérationnelle."
)

pdf.ratio_analysis(
    "ROE (Rentabilité Financière) : 74.1%",
    "Performance exceptionnelle pour les actionnaires, attractivité pour les investisseurs.",
    "Capitaliser sur cette force pour attirer des investissements si nécessaire."
)

# Section VI
pdf.add_page()
pdf.section_title('VI. Synthèse Stratégique et Recommandations')

pdf.set_font('Arial', 'B', 11)
pdf.cell(0, 8, "Points Forts Majeurs :", 0, 1)
pdf.set_font('Arial', '', 10)
pdf.multi_cell(0, 6, "- Trésorerie nette positive et FRNG excédentaire\n- Autonomie financière exceptionnelle (67%)\n- Délais clients très courts (17 jours)\n- Rentabilité financière exceptionnelle (ROE 74.1%)\n- Structure financière équilibrée (Taux financement 1.17)")

pdf.ln(5)
pdf.set_font('Arial', 'B', 11)
pdf.cell(0, 8, "Points de Vigilance :", 0, 1)
pdf.set_font('Arial', '', 10)
pdf.multi_cell(0, 6, "1. Liquidité réduite (0.057) : Dépendance excessive aux stocks\n2. Délais fournisseurs (16j) : Marge d'amélioration par négociation\n3. Couverture des dettes financières (84%) : Analyse coût de la dette nécessaire")

pdf.ln(5)
pdf.set_font('Arial', 'B', 11)
pdf.cell(0, 8, "Plan d'Action Prioritaire :", 0, 1)
pdf.set_font('Arial', '', 10)
pdf.multi_cell(0, 6, "1. Renégocier les délais paiement fournisseurs (objectif: 30+ jours)\n2. Audit de la gestion des stocks et créances clients\n3. Analyse détaillée du coût de l'endettement\n4. Mettre en place des simulations d'investissement\n5. Capitaliser la trésorerie excédentaire (10 500 DZ)")

pdf.ln(5)
pdf.set_font('Arial', 'I', 10)
pdf.multi_cell(0, 6, "Conclusion : Votre entreprise présente une santé financière exceptionnelle avec des fondamentaux solides. Les axes d'optimisation identifiés concernent principalement la gestion opérationnelle à court terme et l'optimisation de la structure financière pour préparer la croissance future.")

# Génération du fichier
pdf.output('rapport_financier.pdf')
