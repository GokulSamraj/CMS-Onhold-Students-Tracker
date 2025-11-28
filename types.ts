
export interface Student {
  id: string;
  initiatedDate: string;
  studentName: string;
  phoneNumber?: string;
  registeredMailId: string;
  category: string;
  heldSchoolSection: string;
  changedToSchoolSection?: string;
  reminderDate: string;
  initiatedBy: string;
  team?: string;
  reasonToHold: string;
  followUpComments?: string;
  status?: Status;
  createdByEmail?: string;
  
  // Automation Fields
  remindersSent?: string[]; // e.g. ['prev_day', 'morning', 'evening']
  stopReminders?: boolean;  // If true, auto-reminders are disabled
}

export interface Activity {
    id: string;
    user: string;
    action: 'LOGIN' | 'LOGOUT' | 'ADD_STUDENT' | 'EDIT_STUDENT' | 'DELETE_STUDENT' | 'ANALYZE_STUDENT' | 'UNAUTHORIZED_ACCESS' | 'SEND_EMAIL' | 'TOGGLE_REMINDER';
    details: string;
    timestamp: string;
}

// TODO: PLEASE UPDATE THE EMAIL ADDRESSES BELOW WITH THE ACTUAL AGENT EMAILS
export const initiators = [
    { name: "Jaya Shri P", team: "Operations", email: "jayashri.p@lmes.in" },
    { name: "Nagaraj S", team: "Operations", email: "nagaraj.s@lmes.in" },
    { name: "P S Shalini", team: "Operations", email: "shalini.ps@lmes.in" },
    { name: "Nandukumaran P", team: "Operations", email: "nandukumaran.p@lmes.in" },
    { name: "Prathap S", team: "Operations", email: "prathap.s@lmes.in" },
    { name: "Gokul Samraj", team: "Operations", email: "gokul_s@lmes.in" },
    { name: "Sivasankaran R", team: "Support - Voice Team", email: "sivasankaran.r@lmes.in" },
    { name: "Sakthivel Elumalai", team: "Support - Voice Team", email: "sakthivel.elumalai@lmes.in" },
    { name: "Mani Bharathi C", team: "Support - Voice Team", email: "mani.bharathi@lmes.in" },
    { name: "Charulatha S", team: "Support - Voice Team", email: "charulatha.s@lmes.in" },
    { name: "Sivaprakash S", team: "Support - Voice Team", email: "sivaprakash.s@lmes.in" },
    { name: "Bharathi R", team: "Support - Voice Team", email: "bharathi.r@lmes.in" },
    { name: "Sansi Stafina", team: "Support - Voice Team", email: "sansi.stafina@lmes.in" },
    { name: "Dharshini", team: "Support - Voice Team", email: "dharshini@lmes.in" },
    { name: "Vinoth Kumar", team: "Support - Voice Team", email: "vinoth.kumar@lmes.in" },
    { name: "Srinath M", team: "Support - Voice Team", email: "srinath.m@lmes.in" },
    { name: "Arthi M", team: "Support - Voice Team", email: "arthi.m@lmes.in" },
    { name: "Porselvan", team: "Support - Voice Team", email: "porselvan@lmes.in" },
    { name: "SivaPriya G", team: "Retention Team", email: "sivapriya.g@lmes.in" },
    { name: "Naveena R", team: "Retention Team", email: "naveena.r@lmes.in" },
    { name: "Abishek", team: "Support - Non Voice Team", email: "abishek@lmes.in" },
    { name: "Abdul", team: "Support - Non Voice Team", email: "abdul@lmes.in" },
    { name: "Ananthi", team: "Support - Non Voice Team", email: "ananthi@lmes.in" },
    { name: "karthick Varun", team: "Support - Non Voice Team", email: "karthick.varun@lmes.in" },
    { name: "Deepika", team: "Support - Non Voice Team", email: "deepika@lmes.in" },
    { name: "Ririth", team: "Support - Non Voice Team", email: "ririth@lmes.in" },
];

export const teams = [...new Set(initiators.map(i => i.team))];

export const schoolSections = [
    "CMS - Tamil / Level 1 Junior",
    "CMS - Tamil / Level 1 Senior",
    "CMS - Tamil / Level 2 Junior",
    "CMS - Tamil / Level 2 Senior",
    "CMS - PAN India / Junior",
    "CMS - PAN India / Senior",
];

export enum Status {
    ON_HOLD = "On hold",
    ADDED = "Added",
    PENDING = "Pending",
    REFUNDED = "Refunded",
    DISCONTINUED = "Discontinued"
}
