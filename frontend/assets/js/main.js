/**
 * Main 
 */
 
 'use strict';

let menu, animate;

// Global variables for storing all inputs and calculations
window.globalInputs = {};
window.globalCalculations = {};
window.globalTable2Inputs = {};
window.globalTable2Calculations = {};

(function () {
  // Initialize menu
  //-----------------

  let layoutMenuEl = document.querySelectorAll('#layout-menu');
  layoutMenuEl.forEach(function (element) {
    menu = new Menu(element, {
      orientation: 'vertical',
      closeChildren: false
    });
    // Change parameter to true if you want scroll animation
    window.Helpers.scrollToActive((animate = false));
    window.Helpers.mainMenu = menu;
  });

  // Initialize menu togglers and bind click on each
  let menuToggler = document.querySelectorAll('.layout-menu-toggle');
  menuToggler.forEach(item => {
    item.addEventListener('click', event => {
      event.preventDefault();
      window.Helpers.toggleCollapsed();
    });
  });

  // Display menu toggle (layout-menu-toggle) on hover with delay
  let delay = function (elem, callback) {
    let timeout = null;
    elem.onmouseenter = function () {
      // Set timeout to be a timer which will invoke callback after 300ms (not for small screen)
      if (!Helpers.isSmallScreen()) {
        timeout = setTimeout(callback, 300);
      } else {
        timeout = setTimeout(callback, 0);
      }
    };

    elem.onmouseleave = function () {
      // Clear any timers set to timeout
      document.querySelector('.layout-menu-toggle').classList.remove('d-block');
      clearTimeout(timeout);
    };
  };
  if (document.getElementById('layout-menu')) {
    delay(document.getElementById('layout-menu'), function () {
      // not for small screen
      if (!Helpers.isSmallScreen()) {
        document.querySelector('.layout-menu-toggle').classList.add('d-block');
      }
    });
  }

  // Display in main menu when menu scrolls
  let menuInnerContainer = document.getElementsByClassName('menu-inner'),
    menuInnerShadow = document.getElementsByClassName('menu-inner-shadow')[0];
  if (menuInnerContainer.length > 0 && menuInnerShadow) {
    menuInnerContainer[0].addEventListener('ps-scroll-y', function () {
      if (this.querySelector('.ps__thumb-y').offsetTop) {
        menuInnerShadow.style.display = 'block';
      } else {
        menuInnerShadow.style.display = 'none';
      }
    });
  }

  // Init helpers & misc
  // --------------------

  // Init BS Tooltip
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Accordion active class
  const accordionActiveFunction = function (e) {
    if (e.type == 'show.bs.collapse' || e.type == 'show.bs.collapse') {
      e.target.closest('.accordion-item').classList.add('active');
    } else {
      e.target.closest('.accordion-item').classList.remove('active');
    }
  };

  const accordionTriggerList = [].slice.call(document.querySelectorAll('.accordion'));
  const accordionList = accordionTriggerList.map(function (accordionTriggerEl) {
    accordionTriggerEl.addEventListener('show.bs.collapse', accordionActiveFunction);
    accordionTriggerEl.addEventListener('hide.bs.collapse', accordionActiveFunction);
  });

  // Auto update layout based on screen size
  window.Helpers.setAutoUpdate(true);

  // Toggle Password Visibility
  window.Helpers.initPasswordToggle();

  // Speech To Text
  window.Helpers.initSpeechToText();

  // Manage menu expanded/collapsed with templateCustomizer & local storage
  //------------------------------------------------------------------

  // If current layout is horizontal OR current window screen is small (overlay menu) than return from here
  if (window.Helpers.isSmallScreen()) {
    return;
  }

  // If current layout is vertical and current window screen is > small

  // Auto update menu collapsed/expanded based on the themeConfig
  window.Helpers.setCollapsed(true, false);
})();

var capitauxPropres;

document.addEventListener('DOMContentLoaded', () => {
  // Store in global variables
  window.globalInputs = {};
  window.globalCalculations = {};

  // Configuration for cells
  const cellConfig = {
    // Input Cells
    immobilisations_incorporelles: { isInput: true },
    immobilisations_corporelles: { isInput: true },
    immobilisations_financieres: { isInput: true },
    capitaux_propres: { isInput: true },
    provisions_risques_charges: { isInput: true },
    amortissements: { isInput: true },
    dettes_financieres: { isInput: true },
    actif_circulant_exploitation: { isInput: true },
    actif_circulant_hors_exploitation: { isInput: true },
    tresorerie_disponible: { isInput: true },
    passif_circulant_exploitation: { isInput: true },
    passif_circulant_hors_exploitation: { isInput: true },
    tresorerie_passive: { isInput: true },

    // New ratio inputs
    endettement: { isInput: true },
    chiffre_affaires: { isInput: true },
    stock_moyen: { isInput: true },
    cout_achat: { isInput: true },
    creances_clients: { isInput: true },
    ca_ttc: { isInput: true },
    dettes_fournisseurs: { isInput: true },
    achats_ttc: { isInput: true },

    // Calculated Cells
    total_emplois_stables: {
      calculate: () => sum(
        'immobilisations_incorporelles',
        'immobilisations_corporelles',
        'immobilisations_financieres'
      )
    },
    total_actif_circulant: {
      calculate: () => sum(
        'tresorerie_disponible',
        'actif_circulant_hors_exploitation',
        'actif_circulant_exploitation'
      )
    },
    total_passif_circulant: {
      calculate: () => sum(
        'passif_circulant_exploitation',
        'passif_circulant_hors_exploitation',
        'tresorerie_passive'
      )
    },
    total_ressources_stables: {
      calculate: () => sum(
        'capitaux_propres',
        'provisions_risques_charges',
        'amortissements',
        'dettes_financieres'
      )
    },
    total_emplois: {
      calculate: () => sum(
        'total_emplois_stables',
        'actif_circulant_exploitation',
        'actif_circulant_hors_exploitation',
        'tresorerie_disponible'
      )
    },
    total_ressources: {
      calculate: () => sum(
        'total_ressources_stables',
        'passif_circulant_exploitation',
        'passif_circulant_hors_exploitation',
        'tresorerie_passive'
      )
    },
    frng: {
      calculate: () => window.globalCalculations.total_ressources_stables - window.globalCalculations.total_emplois_stables
    },
    bfr: {
      calculate: () => sum(
        'actif_circulant_exploitation',
        'actif_circulant_hors_exploitation'
      ) - sum(
        'passif_circulant_exploitation',
        'passif_circulant_hors_exploitation'
      )
    },
    tresorerie_nette: {
      calculate: () => parse(window.globalInputs.tresorerie_disponible) - parse(window.globalInputs.tresorerie_passive)
    },
  };

  capitauxPropres = document.getElementById('capitaux_propres');

  // Helper functions
  function parse(value) {
    if (typeof value === 'string') {
      return parseFloat(value.replace(/,/g, '.').replace(/[^0-9.]/g, '')) || 0;
    }
    return value || 0;
  }

  function format(value, type = 'currency') {
    const numericValue = typeof value === 'number' ? value : 0;

    if (type === 'currency') {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2
      }).format(numericValue);
    }
    if (type === 'number') {
      return numericValue.toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
    if (type === 'days') {
      return `${Math.round(numericValue).toLocaleString('fr-FR')} jours`;
    }
    return numericValue;
  }
  globalCalculations['total_ressources_stables']
  function sum(...keys) {
    return keys.reduce((acc, key) => acc + (window.globalCalculations[key] || parse(window.globalInputs[key])), 0);
  }

  function safeDivide(numerator, denominator) {
    return denominator === 0 ? 0 : numerator / denominator;
  }

  function updateCalculations() {
    // First update all calculations
    Object.keys(cellConfig).forEach(key => {
      if (cellConfig[key].calculate) {
        window.globalCalculations[key] = cellConfig[key].calculate();
      }
    });

    // Then update DOM elements
    Object.keys(window.globalCalculations).forEach(key => {
      const element = document.getElementById(key);
      if (element) {
        // Special formatting for different value types
        if (key.startsWith('delai_')) {
          element.textContent = format(window.globalCalculations[key], 'days');
        } else if (key.startsWith('ratio_')) {
          element.textContent = format(window.globalCalculations[key], 'number');
        } else {
          element.textContent = format(window.globalCalculations[key], 'currency');
        }
      }
    });
  }

  // Initialize input listeners
  Object.keys(cellConfig).forEach(key => {
    if (cellConfig[key].isInput) {
      const input = document.getElementById(key);
      if (input) {
        input.addEventListener('input', () => {
          window.globalInputs[key] = input.value;
          updateCalculations();
        });
        // Initialize input values
        window.globalInputs[key] = input.value;
      }
    }
  });

  // Initial calculation
  updateCalculations();

   
});

///table2////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
  // Store in global variables
  window.globalTable2Inputs = {};
  window.globalTable2Calculations = {};

  const frenchFormatter = new Intl.NumberFormat('en-EN', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  function parseNumber(value) {
    return parseFloat(value.replace(/[ \s]/g, '').replace(/,/g, '.')) || 0;
  }

  function formatNumber(value) {
    return frenchFormatter.format(value).replace(/,/g, ' ').replace(/\./, ',');
  }

  function updateCalculations() {
    // Helper: parse numbers
    const parseNumber = (value) => parseFloat(value) || 0;
    const formatNumber = (num) => num.toFixed(2); // Adjust formatting as needed

    // Store all inputs in global variables
    const inputIds = [
      'n_ca', 'n1_ca', 'n_stock', 'n1_stock', 'n_immobilis', 'n1_immobilis',
      'n_exploitation', 'n1_exploitation', 'n_PRODUCTION_DE_L_EXERCICE', 'n1_PRODUCTION_DE_L_EXERCICE',
      'n_ACHATS_CONSOMMES', 'n1_ACHATS_CONSOMMES', 'n_SERVICES_AUTRES_CONSOMMATIONS', 'n1_SERVICES_AUTRES_CONSOMMATIONS',
      'n_CONSOMMATION_EXERCICE', 'n1_CONSOMMATION_EXERCICE', 'n_VALEUR_AJOUTEE_EXPLOITATION', 'n1_VALEUR_AJOUTEE_EXPLOITATION',
      'n_CHARGES_PERSONNEL', 'n1_CHARGES_PERSONNEL', 'n_IMPOTS_TAXES', 'n1_IMPOTS_TAXES',
      'n_EXCEDENT_BRUT_EXPLOITATION', 'n1_EXCEDENT_BRUT_EXPLOITATION', 'n_AUTRES_PRODUITS_OPERATIONNELS', 'n1_AUTRES_PRODUITS_OPERATIONNELS',
      'n_AUTRES_CHARGES_OPERATIONNELLES', 'n1_AUTRES_CHARGES_OPERATIONNELLES', 'n_DOTATIONS', 'n1_DOTATIONS',
      'n_REPRISES', 'n1_REPRISES', 'n_RESULTAT_OPERATIONNEL', 'n1_RESULTAT_OPERATIONNEL',
      'n_PRODUITS_FINANCIERS', 'n1_PRODUITS_FINANCIERS', 'n_CHARGES_FINANCIERES', 'n1_CHARGES_FINANCIERES',
      'n_RESULTAT_FINANCIER', 'n1_RESULTAT_FINANCIER', 'n_RESULTAT_ORDINAIRE_AVANT_IMPOTS', 'n1_RESULTAT_ORDINAIRE_AVANT_IMPOTS',
      'n_IMPOTS_EXIGIBLES', 'n1_IMPOTS_EXIGIBLES', 'n_IMPOTS_DIFFERES', 'n1_IMPOTS_DIFFERES',
      'n_TOTAL_PRODUITS_ORDINAIRES', 'n1_TOTAL_PRODUITS_ORDINAIRES', 'n_TOTAL_CHARGES_ORDINAIRES', 'n1_TOTAL_CHARGES_ORDINAIRES',
      'n_RESULTAT_NET_ORDINAIRES', 'n1_RESULTAT_NET_ORDINAIRES', 'n_EXTRA_PRODUITS', 'n1_EXTRA_PRODUITS',
      'n_EXTRA_CHARGES', 'n1_EXTRA_CHARGES', 'n_RESULTAT_EXTRAORDINAIRE', 'n1_RESULTAT_EXTRAORDINAIRE',
      'n_RESULTAT_NET_EXERCICE', 'n1_RESULTAT_NET_EXERCICE'
    ];

    inputIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        window.globalTable2Inputs[id] = parseNumber(element.value);
      }
    });

    // Chiffre d'affaires
    const nCA = window.globalTable2Inputs.n_ca;
    const n1CA = window.globalTable2Inputs.n1_ca;
    const varCA = nCA - n1CA;
    window.globalTable2Calculations.var_ca = varCA;
    document.getElementById('var_ca').textContent = formatNumber(varCA);

    // Variation stocks
    const nStock = window.globalTable2Inputs.n_stock;
    const n1Stock = window.globalTable2Inputs.n1_stock;
    const varStock = nStock - n1Stock;
    window.globalTable2Calculations.var_stock = varStock;
    document.getElementById('var_stock').textContent = formatNumber(varStock);

    // Production immobilisée
    const nImmobilis = window.globalTable2Inputs.n_immobilis;
    const n1Immobilis = window.globalTable2Inputs.n1_immobilis;
    const varImmobilis = nImmobilis - n1Immobilis;
    window.globalTable2Calculations.Production_immobilis = varImmobilis;
    document.getElementById('Production_immobilis').textContent = formatNumber(varImmobilis);

    // Subventions d'exploitation
    const nExploitation = window.globalTable2Inputs.n_exploitation;
    const n1Exploitation = window.globalTable2Inputs.n1_exploitation;
    const varExploitation = nExploitation - n1Exploitation;
    window.globalTable2Calculations.Subventions_exploitation = varExploitation;
    document.getElementById('Subventions_exploitation').textContent = formatNumber(varExploitation);

    // Production de l'exercice
    const nProdEx = window.globalTable2Inputs.n_PRODUCTION_DE_L_EXERCICE;
    const n1ProdEx = window.globalTable2Inputs.n1_PRODUCTION_DE_L_EXERCICE;
    const varProdEx = nProdEx - n1ProdEx;
    window.globalTable2Calculations.PRODUCTION_DE_L_EXERCICE = varProdEx;
    document.getElementById('PRODUCTION_DE_L_EXERCICE').textContent = formatNumber(varProdEx);

    // Achats consommés
    const nAchats = window.globalTable2Inputs.n_ACHATS_CONSOMMES;
    const n1Achats = window.globalTable2Inputs.n1_ACHATS_CONSOMMES;
    const varAchats = nAchats - n1Achats;
    window.globalTable2Calculations.ACHATS_CONSOMMES = varAchats;
    document.getElementById('ACHATS_CONSOMMES').textContent = formatNumber(varAchats);

    // Services extérieurs
    const nServices = window.globalTable2Inputs.n_SERVICES_AUTRES_CONSOMMATIONS;
    const n1Services = window.globalTable2Inputs.n1_SERVICES_AUTRES_CONSOMMATIONS;
    const varServices = nServices - n1Services;
    window.globalTable2Calculations.SERVICES_AUTRES_CONSOMMATIONS = varServices;
    document.getElementById('SERVICES_AUTRES_CONSOMMATIONS').textContent = formatNumber(varServices);

    // Consommation de l'exercice
    const nConso = window.globalTable2Inputs.n_CONSOMMATION_EXERCICE;
    const n1Conso = window.globalTable2Inputs.n1_CONSOMMATION_EXERCICE;
    const varConso = nConso - n1Conso;
    window.globalTable2Calculations.CONSOMMATION_EXERCICE = varConso;
    document.getElementById('CONSOMMATION_EXERCICE').textContent = formatNumber(varConso);

    // Valeur ajoutée d'exploitation
    const nVA = window.globalTable2Inputs.n_VALEUR_AJOUTEE_EXPLOITATION;
    const n1VA = window.globalTable2Inputs.n1_VALEUR_AJOUTEE_EXPLOITATION;
    const varVA = nVA - n1VA;
    window.globalTable2Calculations.VALEUR_AJOUTEE_EXPLOITATION = varVA;
    document.getElementById('VALEUR_AJOUTEE_EXPLOITATION').textContent = formatNumber(varVA);

    // Charges de personnel
    const nPersonnel = window.globalTable2Inputs.n_CHARGES_PERSONNEL;
    const n1Personnel = window.globalTable2Inputs.n1_CHARGES_PERSONNEL;
    const varPersonnel = nPersonnel - n1Personnel;
    window.globalTable2Calculations.CHARGES_PERSONNEL = varPersonnel;
    document.getElementById('CHARGES_PERSONNEL').textContent = formatNumber(varPersonnel);

    // Impôts et taxes
    const nTaxes = window.globalTable2Inputs.n_IMPOTS_TAXES;
    const n1Taxes = window.globalTable2Inputs.n1_IMPOTS_TAXES;
    const varTaxes = nTaxes - n1Taxes;
    window.globalTable2Calculations.IMPOTS_TAXES = varTaxes;
    document.getElementById('IMPOTS_TAXES').textContent = formatNumber(varTaxes);

    // Excédent brut d'exploitation
    const nEBE = window.globalTable2Inputs.n_EXCEDENT_BRUT_EXPLOITATION;
    const n1EBE = window.globalTable2Inputs.n1_EXCEDENT_BRUT_EXPLOITATION;
    const varEBE = nEBE - n1EBE;
    window.globalTable2Calculations.EXCEDENT_BRUT_EXPLOITATION = varEBE;
    document.getElementById('EXCEDENT_BRUT_EXPLOITATION').textContent = formatNumber(varEBE);

    // Autres produits opérationnels
    const nAutresProd = window.globalTable2Inputs.n_AUTRES_PRODUITS_OPERATIONNELS;
    const n1AutresProd = window.globalTable2Inputs.n1_AUTRES_PRODUITS_OPERATIONNELS;
    const varAutresProd = nAutresProd - n1AutresProd;
    window.globalTable2Calculations.AUTRES_PRODUITS_OPERATIONNELS = varAutresProd;
    document.getElementById('AUTRES_PRODUITS_OPERATIONNELS').textContent = formatNumber(varAutresProd);

    // Autres charges opérationnelles
    const nAutresCharges = window.globalTable2Inputs.n_AUTRES_CHARGES_OPERATIONNELLES;
    const n1AutresCharges = window.globalTable2Inputs.n1_AUTRES_CHARGES_OPERATIONNELLES;
    const varAutresCharges = nAutresCharges - n1AutresCharges;
    window.globalTable2Calculations.AUTRES_CHARGES_OPERATIONNELLES = varAutresCharges;
    document.getElementById('AUTRES_CHARGES_OPERATIONNELLES').textContent = formatNumber(varAutresCharges);

    // Dotations
    const nDot = window.globalTable2Inputs.n_DOTATIONS;
    const n1Dot = window.globalTable2Inputs.n1_DOTATIONS;
    const varDot = nDot - n1Dot;
    window.globalTable2Calculations.DOTATIONS = varDot;
    document.getElementById('DOTATIONS').textContent = formatNumber(varDot);

    // Reprises
    const nReprises = window.globalTable2Inputs.n_REPRISES;
    const n1Reprises = window.globalTable2Inputs.n1_REPRISES;
    const varReprises = nReprises - n1Reprises;
    window.globalTable2Calculations.REPRISES = varReprises;
    document.getElementById('REPRISES').textContent = formatNumber(varReprises);

    // RESULTAT_OPERATIONNEL
    const varOpRes = window.globalTable2Inputs.n_RESULTAT_OPERATIONNEL - window.globalTable2Inputs.n1_RESULTAT_OPERATIONNEL;
    window.globalTable2Calculations.RESULTAT_OPERATIONNEL = varOpRes;
    document.getElementById('RESULTAT_OPERATIONNEL').textContent = formatNumber(varOpRes);

    // PRODUITS_FINANCIERS
    const varProdFin = window.globalTable2Inputs.n_PRODUITS_FINANCIERS - window.globalTable2Inputs.n1_PRODUITS_FINANCIERS;
    window.globalTable2Calculations.PRODUITS_FINANCIERS = varProdFin;
    document.getElementById('PRODUITS_FINANCIERS').textContent = formatNumber(varProdFin);

    // CHARGES_FINANCIERES
    const varChargesFin = window.globalTable2Inputs.n_CHARGES_FINANCIERES - window.globalTable2Inputs.n1_CHARGES_FINANCIERES;
    window.globalTable2Calculations.CHARGES_FINANCIERES = varChargesFin;
    document.getElementById('CHARGES_FINANCIERES').textContent = formatNumber(varChargesFin);

    // RESULTAT_FINANCIER
    const varResFin = window.globalTable2Inputs.n_RESULTAT_FINANCIER - window.globalTable2Inputs.n1_RESULTAT_FINANCIER;
    window.globalTable2Calculations.RESULTAT_FINANCIER = varResFin;
    document.getElementById('RESULTAT_FINANCIER').textContent = formatNumber(varResFin);

    // RESULTAT_ORDINAIRE_AVANT_IMPOTS
    const varOrdAvantImp = window.globalTable2Inputs.n_RESULTAT_ORDINAIRE_AVANT_IMPOTS - window.globalTable2Inputs.n1_RESULTAT_ORDINAIRE_AVANT_IMPOTS;
    window.globalTable2Calculations.RESULTAT_ORDINAIRE_AVANT_IMPOTS = varOrdAvantImp;
    document.getElementById('RESULTAT_ORDINAIRE_AVANT_IMPOTS').textContent = formatNumber(varOrdAvantImp);

    // IMPOTS_EXIGIBLES
    const varImpExig = window.globalTable2Inputs.n_IMPOTS_EXIGIBLES - window.globalTable2Inputs.n1_IMPOTS_EXIGIBLES;
    window.globalTable2Calculations.IMPOTS_EXIGIBLES = varImpExig;
    document.getElementById('IMPOTS_EXIGIBLES').textContent = formatNumber(varImpExig);

    // IMPOTS_DIFFERES
    const varImpDiff = window.globalTable2Inputs.n_IMPOTS_DIFFERES - window.globalTable2Inputs.n1_IMPOTS_DIFFERES;
    window.globalTable2Calculations.IMPOTS_DIFFERES = varImpDiff;
    document.getElementById('IMPOTS_DIFFERES').textContent = formatNumber(varImpDiff);

    // TOTAL_PRODUITS_ORDINAIRES
    const varTotalProdOrd = window.globalTable2Inputs.n_TOTAL_PRODUITS_ORDINAIRES - window.globalTable2Inputs.n1_TOTAL_PRODUITS_ORDINAIRES;
    window.globalTable2Calculations.TOTAL_PRODUITS_ORDINAIRES = varTotalProdOrd;
    document.getElementById('TOTAL_PRODUITS_ORDINAIRES').textContent = formatNumber(varTotalProdOrd);

    // TOTAL_CHARGES_ORDINAIRES
    const varTotalChargesOrd = window.globalTable2Inputs.n_TOTAL_CHARGES_ORDINAIRES - window.globalTable2Inputs.n1_TOTAL_CHARGES_ORDINAIRES;
    window.globalTable2Calculations.TOTAL_CHARGES_ORDINAIRES = varTotalChargesOrd;
    document.getElementById('TOTAL_CHARGES_ORDINAIRES').textContent = formatNumber(varTotalChargesOrd);

    // RESULTAT_NET_ORDINAIRES
    const varResNetOrd = window.globalTable2Inputs.n_RESULTAT_NET_ORDINAIRES - window.globalTable2Inputs.n1_RESULTAT_NET_ORDINAIRES;
    window.globalTable2Calculations.RESULTAT_NET_ORDINAIRES = varResNetOrd;
    document.getElementById('RESULTAT_NET_ORDINAIRES').textContent = formatNumber(varResNetOrd);

    // EXTRA_PRODUITS
    const varExtraProd = window.globalTable2Inputs.n_EXTRA_PRODUITS - window.globalTable2Inputs.n1_EXTRA_PRODUITS;
    window.globalTable2Calculations.EXTRA_PRODUITS = varExtraProd;
    document.getElementById('EXTRA_PRODUITS').textContent = formatNumber(varExtraProd);

    // EXTRA_CHARGES
    const varExtraCharges = window.globalTable2Inputs.n_EXTRA_CHARGES - window.globalTable2Inputs.n1_EXTRA_CHARGES;
    window.globalTable2Calculations.EXTRA_CHARGES = varExtraCharges;
    document.getElementById('EXTRA_CHARGES').textContent = formatNumber(varExtraCharges);

    // RESULTAT_EXTRAORDINAIRE
    const varResExtra = window.globalTable2Inputs.n_RESULTAT_EXTRAORDINAIRE - window.globalTable2Inputs.n1_RESULTAT_EXTRAORDINAIRE;
    window.globalTable2Calculations.RESULTAT_EXTRAORDINAIRE = varResExtra;
    document.getElementById('RESULTAT_EXTRAORDINAIRE').textContent = formatNumber(varResExtra);

    // RESULTAT_NET_EXERCICE
    const varResNetEx = window.globalTable2Inputs.n_RESULTAT_NET_EXERCICE - window.globalTable2Inputs.n1_RESULTAT_NET_EXERCICE;
    window.globalTable2Calculations.RESULTAT_NET_EXERCICE = varResNetEx;
    document.getElementById('RESULTAT_NET_EXERCICE').textContent = formatNumber(varResNetEx);

    // Ratios
    const evoCA = n1CA !== 0 ? varCA / n1CA : 0;
    window.globalTable2Calculations.evo_ca = evoCA;
    document.getElementById('evo_ca').textContent = formatNumber(evoCA);

    const evoVA = n1VA !== 0 ? varVA / n1VA : 0;
    window.globalTable2Calculations.evo_va = evoVA;
    document.getElementById('evo_va').textContent = formatNumber(evoVA);

    //evo_pr
    const evoPR = window.globalTable2Inputs.n1_RESULTAT_NET_EXERCICE !== 0 ? varStock / window.globalTable2Inputs.n1_RESULTAT_NET_EXERCICE : 0;
    window.globalTable2Calculations.evo_pr = evoPR;
    document.getElementById('evo_pr').textContent = formatNumber(evoPR);

    //evo_rne
    const evoRne = window.globalTable2Inputs.n1_RESULTAT_NET_EXERCICE !== 0 ? varResNetEx / window.globalTable2Inputs.n1_RESULTAT_NET_EXERCICE : 0;
    window.globalTable2Calculations.evo_rne = evoRne;
    document.getElementById('evo_rne').textContent = formatNumber(evoRne);

    //- les ratios de rentabilité : ///
    //taux_m_ben
    const tauxMBen = varCA !== 0 ? varResNetEx / varCA : 0;
    window.globalTable2Calculations.taux_m_ben = tauxMBen;
    document.getElementById('taux_m_ben').textContent = formatNumber(tauxMBen);

    // taux_m_bru
    const tauxMru = varCA !== 0 ? varEBE / varCA : 0;
    window.globalTable2Calculations.taux_m_bru = tauxMru;
    document.getElementById('taux_m_bru').textContent = formatNumber(tauxMru);

    //-  Les ratios constatant le partage de la valeur ajoutée : 
    //Part_salaries
    const PartSalaries = varVA !== 0 ? varPersonnel / varVA : 0;
    window.globalTable2Calculations.Part_salaries = PartSalaries;
    document.getElementById('Part_salaries').textContent = formatNumber(PartSalaries);

    //Part_etat
    const PartEtat = varVA !== 0 ? varTaxes / varVA : 0;
    window.globalTable2Calculations.Part_etat = PartEtat;
    document.getElementById('Part_etat').textContent = formatNumber(PartEtat);

    //Part_ebe
    const PartEBE = varVA !== 0 ? varEBE / varVA : 0;
    window.globalTable2Calculations.Part_ebe = PartEBE;
    document.getElementById('Part_ebe').textContent = formatNumber(PartEBE);

    //-  Les ratios constatant le partage de EBE : 
    //part_imm_par_EBE
    const PartImmParEBE = varEBE !== 0 ? varDot / varEBE : 0;
    window.globalTable2Calculations.part_imm_par_EBE = PartImmParEBE;
    document.getElementById('part_imm_par_EBE').textContent = formatNumber(PartImmParEBE);

    //part_preteurs
    const PartPreteurs = varEBE !== 0 ? varChargesFin / varEBE : 0;
    window.globalTable2Calculations.part_preteurs = PartPreteurs;
    document.getElementById('part_preteurs').textContent = formatNumber(PartPreteurs);

    //part_result_ordi
    const PartResultOrdi = varEBE !== 0 ? varOrdAvantImp / varEBE : 0;
    window.globalTable2Calculations.part_result_ordi = PartResultOrdi;
    document.getElementById('part_result_ordi').textContent = formatNumber(PartResultOrdi);

    //- les ratios supplémentaires : 
    //taux_integ
    const TauxInteg = varCA !== 0 ? varVA / varCA : 0;
    window.globalTable2Calculations.taux_integ = TauxInteg;
    document.getElementById('taux_integ').textContent = formatNumber(TauxInteg);

    // Rentabilité des capitaux propres
    const capitauxPropres = parseFloat(document.getElementById('capitaux_propres').value) || 0;
    const rentabiliteCaptProp = (capitauxPropres !== 0) ? (varResNetEx / capitauxPropres) : 0;

    window.globalTable2Calculations.taux_integ = rentabiliteCaptProp;
    document.getElementById('rentabilite_capt_prop').textContent = formatNumber(rentabiliteCaptProp);
    //Rentabilité des capitaux propres hors éléments exceptionnels
    const rentabiliteCaptPropHors = (capitauxPropres !== 0) ? (varOrdAvantImp / capitauxPropres) : 0;

    window.globalTable2Calculations.taux_integ = rentabiliteCaptPropHors;
    document.getElementById('rentabilite_capt_prop_hors').textContent = formatNumber(rentabiliteCaptPropHors);
    //Rentabilité économique
    const rentabiliteEconomique = (capitauxPropres !== 0) ? ((varResNetEx + varChargesFin) / globalCalculations['total_ressources_stables']
    ) : 0;

    window.globalTable2Calculations.taux_integ = rentabiliteEconomique;
    document.getElementById('rentabilite_economique').textContent = formatNumber(rentabiliteEconomique);
  //Rentabilité brute des ressources stables
  const rentabiliteBruteRessources = (capitauxPropres !== 0) ? (varEBE / globalCalculations['total_ressources_stables']
  ) : 0;

  window.globalTable2Calculations.taux_integ = rentabiliteBruteRessources;
  document.getElementById('rentabilite_brute_ressources_stables').textContent = formatNumber(rentabiliteBruteRessources);

  
  //table03
 
 // total_positif  
 // total_positif
const totalPositif =
  (parseFloat(document.getElementById('impots_benefices').value) || 0) +
  (parseFloat(document.getElementById('participations_salaries').value) || 0) +
  (parseFloat(document.getElementById('charges_exceptionnelles').value) || 0) +
  (parseFloat(document.getElementById('produits_exceptionnels').value) || 0) +
  (parseFloat(document.getElementById('charges_financieres').value) || 0) +
  (parseFloat(document.getElementById('charge_exploitation').value) || 0) +
  (parseFloat(document.getElementById('produits_financiers').value) || 0) +
  (parseFloat(document.getElementById('produit_exploitation').value) || 0) +
  (parseFloat(document.getElementById('excedent_brut').value) || 0);

window.globalTable2Calculations.taux_integ = totalPositif;
document.getElementById('total_positif').textContent = formatNumber(totalPositif);

// total_negatif
const totalNegatif =
  (parseFloat(document.getElementById('impots_benefices_neg').value) || 0) +
  (parseFloat(document.getElementById('participations_salaries_neg').value) || 0) +
  (parseFloat(document.getElementById('charges_exceptionnelles_neg').value) || 0) +
  (parseFloat(document.getElementById('produits_exceptionnels_neg').value) || 0) +
  (parseFloat(document.getElementById('charges_financieres_neg').value) || 0) +
  (parseFloat(document.getElementById('charge_exploitation_neg').value) || 0) +
  (parseFloat(document.getElementById('produits_financiers_neg').value) || 0) +
  (parseFloat(document.getElementById('produit_exploitation_neg').value) || 0) +
  (parseFloat(document.getElementById('excedent_brut_neg').value) || 0);

window.globalTable2Calculations.taux_integ_neg = totalNegatif;
document.getElementById('total_negatif').textContent = formatNumber(totalNegatif);


const totalCap = totalNegatif + totalPositif;

window.globalTable2Calculations.total_cap = totalCap;
document.getElementById('total_cap').textContent = formatNumber(totalCap);

  //table03

}


  // Add event listeners to all inputs
  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', updateCalculations);
  });

  // Initial calculation
  updateCalculations();

  // Ratios Section
  const nReprises = parseNumber(document.getElementById('n_REPRISES').value);
  const n1Reprises = parseNumber(document.getElementById('n1_REPRISES').value);
  document.getElementById('REPRISES').textContent = formatNumber(nReprises - n1Reprises);
});



 

// Helper functions for formatting
function formatCurrency(value) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(value || 0);
}

function formatPercent(value) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'percent',
    minimumFractionDigits: 2
  }).format(value || 0);
}
///////////////////////////////////
//
document.getElementById('generatePdfBtn').addEventListener('click', async () => {
    const reportData = {
      table1: {
        inputs: { ...window.globalInputs },
        calculations: { ...window.globalCalculations }
      },
      table2: {
        inputs: { ...window.globalTable2Inputs },
        calculations: { ...window.globalTable2Calculations }
      }
    };
 const response = await fetch('http://localhost:3000/generate-report', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ reportData })
});

const result = await response.json();
const reportText = result.report;
// Puis tu génères le PDF comme avant

  });