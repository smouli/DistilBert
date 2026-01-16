"""Preset templates for common use cases"""

PRESET_DATA = {
    "manufacturing": {
        "name": "Manufacturing",
        "icon": "🏭",
        "subtitle": "Procurement & Rebate Recovery",
        "tags": ["Purchase Orders", "Suppliers", "Rebates"],
        "entities": [
            {"name": "SUPPLIER_NAME", "description": "Vendor or supplier company names"},
            {"name": "PRODUCT_CODE", "description": "SKU, part numbers, product identifiers"},
            {"name": "PURCHASE_ORDER", "description": "PO numbers and identifiers"},
            {"name": "INVOICE_NUMBER", "description": "Invoice reference numbers"},
            {"name": "AMOUNT", "description": "Monetary values, prices, rebate amounts"},
            {"name": "DATE", "description": "Transaction dates, delivery dates, payment terms"},
            {"name": "QUANTITY", "description": "Order quantities, volumes"},
            {"name": "REBATE_TIER", "description": "Rebate levels, volume tiers"},
            {"name": "PAYMENT_TERMS", "description": "Net 30, Net 60, payment conditions"},
            {"name": "MATERIAL_TYPE", "description": "Raw materials, finished goods categories"}
        ],
        "intents": [
            {"name": "create_purchase_order", "description": "Creating new purchase orders"},
            {"name": "track_shipment", "description": "Tracking delivery status"},
            {"name": "process_invoice", "description": "Processing supplier invoices"},
            {"name": "calculate_rebate", "description": "Computing rebate amounts based on volume"},
            {"name": "verify_pricing", "description": "Validating prices against contracts"},
            {"name": "check_inventory", "description": "Checking stock levels"},
            {"name": "request_quote", "description": "Requesting supplier quotations"},
            {"name": "claim_rebate", "description": "Filing rebate recovery claims"}
        ]
    },
    "ma": {
        "name": "M&A Contracts",
        "icon": "🤝",
        "subtitle": "Customer, Vendor & Employee",
        "tags": ["Contract Terms", "Obligations", "Compliance"],
        "entities": [
            {"name": "PARTY_NAME", "description": "Customer, vendor, or employee names"},
            {"name": "CONTRACT_ID", "description": "Contract reference numbers"},
            {"name": "CONTRACT_TYPE", "description": "Customer, vendor, employment agreement types"},
            {"name": "EFFECTIVE_DATE", "description": "Contract start dates"},
            {"name": "EXPIRATION_DATE", "description": "Contract end dates, termination dates"},
            {"name": "OBLIGATION", "description": "Contractual duties and responsibilities"}
        ],
        "intents": [
            {"name": "extract_key_terms", "description": "Identifying critical contract provisions"},
            {"name": "identify_obligations", "description": "Finding party obligations and commitments"},
            {"name": "check_compliance", "description": "Verifying regulatory compliance"},
            {"name": "flag_risks", "description": "Identifying potential legal or financial risks"}
        ]
    },
    "pharma": {
        "name": "Pharmaceutical",
        "icon": "💊",
        "subtitle": "Drug Discovery & Clinical Trials",
        "tags": ["Adverse Events", "Clinical Data", "Compliance"],
        "entities": [
            {"name": "DRUG_NAME", "description": "Pharmaceutical drug names, compounds, generic names"},
            {"name": "DOSAGE", "description": "Drug dosage amounts and units (mg, ml, etc.)"},
            {"name": "ADVERSE_EVENT", "description": "Side effects, adverse reactions, safety events"},
            {"name": "PATIENT_ID", "description": "Patient identifiers, study subject numbers"},
            {"name": "TRIAL_PHASE", "description": "Clinical trial phases (Phase I, II, III, IV)"},
            {"name": "INDICATION", "description": "Medical conditions, diseases being treated"}
        ],
        "intents": [
            {"name": "report_adverse_event", "description": "Reporting side effects or safety concerns"},
            {"name": "query_trial_status", "description": "Checking clinical trial progress or enrollment"},
            {"name": "extract_efficacy_data", "description": "Retrieving clinical effectiveness results"},
            {"name": "check_drug_interaction", "description": "Identifying potential drug-drug interactions"}
        ]
    }
}

