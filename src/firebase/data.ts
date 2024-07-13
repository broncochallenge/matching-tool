export type SESSION_TOKEN = {
  id: string;
  email: string;
  time: string;
};
export type UN_SDG = {
  id: string;
  details: string;
  short: string;
};
enum PARTICIPATION_STATUS {
  ON_A_TEAM = "On a team",
  LOOKING_FOR_A_TEAM = "Look for a team",
  UNDECIDED = "Undecided",
  OTHERS = "Other",
}

export type MATCH_REQUEST_ENTRY = {
  id: string;
  name: string;
  message: string;
  email: string;
  teamName: string;
  sdgsOfInterest: string[];
  teamMajors: string[];
  members: PARTICIPANT[];
  memberEmails: string[];
  participation_status: PARTICIPATION_STATUS;
  /** Description: Skills that the team is looking for in a team member */
  desired_skills: string[];
};
export type PARTICIPANT = {
  id: string;
  name: string;
  email: string;
  academic_major: string;
  academic_level: string;
  team: string[];
  skills: string[];
};

const sdgs: UN_SDG[] = [
  {
    id: "1",
    short: "No Poverty",
    details: "End poverty in all its forms everywhere",
  },
  {
    id: "2",
    short: "Zero Hunger",
    details:
      "End hunger, achieve food security and improved nutrition and promote sustainable agriculture ",
  },
  {
    id: "3",
    short: "Good Health & Well Being",
    details: "Ensure healthy lives and promote well-being for all at all ages ",
  },
  {
    id: "4",
    short: "Quality Education",
    details: `Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all `,
  },
  {
    id: "5",
    short: "Gender Equality",
    details: "Achieve gender equality and empower all women and girls ",
  },
  {
    id: "6",
    short: "Clean Water and Sanitation",
    details:
      "Ensure availability and sustainable management of water and sanitation for all ",
  },
  {
    id: "7",
    short: "Available and Clean Energy",
    details:
      "Ensure access to affordable, reliable, sustainable and modern energy forall ",
  },
  {
    id: "8",
    short: "Decent Work and Economic Growth",
    details:
      "Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all ",
  },
  {
    id: "9",
    short: "Industry, Innovation and Infrastructure",
    details:
      "Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation",
  },
  {
    id: "10",
    short: "Reduced Inequality",
    details: "Reduce inequality within and among countries ",
  },
  {
    id: "11",
    short: "Sustainable Cities and Communities",
    details:
      "Make cities and human settlements inclusive, safe, resilient and sustainable ",
  },
  {
    id: "12",
    short: "Responsible Consumption and Production",
    details: "Ensure sustainable consumption and production patterns ",
  },
  {
    id: "13",
    short: "Climate Action",
    details: "Take urgent action to combat climate change and its impacts ",
  },
  {
    id: "14",
    short: "Life Below Water",
    details:
      "Conserve and sustainably use the oceans, seas and marine resources for sustainable development",
  },
  {
    id: "15",
    short: "Life on Land",
    details:
      "Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt and reverse land degradation and halt biodiversity loss ",
  },
  {
    id: "16",
    short: "Peace & Justice Strong Institutions",
    details:
      "Promote peaceful and inclusive societies for sustainable development, provide access to justice for all and build effective, accountable and inclusive institutions at all levels ",
  },
  {
    id: "17",
    short: "Partnerships to Achieve the Goals",
    details:
      "Strengthen the means of implementation and revitalize the Global Partnership for Sustainable Development ",
  },
];

const skills_and_interests = [
  {
    category: "Technical Skills",
    detail: [
      "Programming languages (e.g., Python, Java, JavaScript)",
      "Web development (HTML, CSS, React, Angular)",
      "Data analysis and visualization",
      "Database management (SQL, NoSQL)",
      "Software development methodologies (Agile, Scrum)",
    ],
  },
  {
    category: "Design Skills",
    detail: [
      "Graphic design",
      "User interface (UI) and user experience (UX) design",
      "Prototyping and wireframing",
      "Branding and visual identity",
    ],
  },
  {
    category: "Communication and Collaboration Skills",
    detail: [
      "Verbal and written communication",
      "Teamwork and collaboration",
      "Project management",
      "Presentation skills",
    ],
  },
  {
    category: "Domain-specific Knowledge",
    detail: [
      "Sustainability and environmental science",
      "Sustainable development goals (SDGs)",
      "Social entrepreneurship",
      "Public policy and advocacy",
    ],
  },
  {
    category: "Problem-solving and Critical Thinking",
    detail: [
      "Analytical thinking",
      "Problem-solving skills",
      "Creativity and innovation",
      "Adaptability and flexibility",
    ],
  },
  {
    category: "Research and Analysis",
    detail: [
      "Research methodologies",
      "Data collection and analysis",
      "Market research",
      "Competitive analysis",
    ],
  },
  {
    category: "Leadership and Management",
    detail: [
      "Leadership skills",
      "Decision-making",
      "Conflict resolution",
      "Time management",
    ],
  },
  {
    category: "Miscellaneous",
    detail: [
      "Marketing and branding",
      "Finance and budgeting",
      "Legal and regulatory compliance",
      "Networking and relationship building",
    ],
  },
];

const majors = [
  { name: "Arts and Science College of", value: "A-S" },
  { name: "African Amer &amp; African Studies", value: "AAAS" },
  { name: "Accountancy", value: "ACTY" },
  { name: "ADA/SPADA", value: "ADA" },
  { name: "Aerospace Engineering", value: "AE" },
  { name: "Anthropology", value: "ANTH" },
  { name: "Arabic", value: "ARAB" },
  { name: "Art, Frostic School of", value: "ART" },
  { name: "Aviation Sciences", value: "AVS" },
  { name: "Business Info Systems - BCM", value: "BCM" },
  { name: "Biological Sciences", value: "BIOS" },
  { name: "Blindness &amp; Low Vision Studies", value: "BLS" },
  { name: "Business", value: "BUS" },
  { name: "Civil &amp; Construction Engineer", value: "CCE" },
  { name: "Counsler Ed/Counseling Psych", value: "CECP" },
  { name: "Coll Educ &amp; Human Development", value: "CEHD" },
  { name: "Chemical Engineering", value: "CHEG" },
  { name: "Chemistry", value: "CHEM" },
  { name: "Chinese", value: "CHIN" },
  { name: "Chemical and Paper Engineering", value: "CHP" },
  { name: "Business Info Systems - CIS", value: "CIS" },
  { name: "Communication, School of", value: "COM" },
  { name: "Computer Science", value: "CS" },
  { name: "Cybersecurity: CS", value: "CYCS" },
  { name: "Cybersecurity: CIS", value: "CYIS" },
  { name: "Dance", value: "DANC" },
  { name: "Electrical &amp; Computer Engineer", value: "ECE" },
  { name: "Economics", value: "ECON" },
  { name: "Education", value: "ED" },
  { name: "Educational Leadership", value: "EDLD" },
  { name: "Engr Design Mfg &amp; Mgmt Systems", value: "EDMM" },
  { name: "Educational Technology", value: "EDT" },
  { name: "Engineering Management", value: "EM" },
  { name: "Eval Measurement &amp; Research", value: "EMR" },
  { name: "English", value: "ENGL" },
  { name: "Engineering &amp; Applied Sciences", value: "ENGR" },
  { name: "Environ/Sustainability Studies", value: "ENVS" },
  { name: "Educational Studies", value: "ES" },
  { name: "English as a Second Language", value: "ESL" },
  { name: "Evaluation", value: "EVAL" },
  { name: "Family And Consumer Sciences", value: "FCS" },
  { name: "Finance &amp; Com Law - Finance", value: "FIN" },
  { name: "French", value: "FREN" },
  { name: "Geography", value: "GEOG" },
  { name: "Geosciences", value: "GEOS" },
  { name: "German", value: "GER" },
  { name: "Global &amp; International Studies", value: "GIST" },
  { name: "Graduate College", value: "GRAD" },
  { name: "Gender and Women's Studies", value: "GWS" },
  { name: "History", value: "HIST" },
  { name: "Honors College", value: "HNRS" },
  { name: "Holistic Health Care", value: "HOL" },
  { name: "Human Performance &amp; Health Ed", value: "HPHE" },
  { name: "Health Services", value: "HSV" },
  { name: "Indust &amp; Entrepreneurial Engr", value: "IEE" },
  { name: "Interdisciplinary Hlth Science", value: "IHS" },
  { name: "International &amp; Global Studies", value: "INTL" },
  { name: "Interprofessional Education", value: "IPE" },
  { name: "Japanese", value: "JPNS" },
  { name: "Journalism", value: "JRN" },
  { name: "World Languages &amp; Literatures", value: "LANG" },
  { name: "Latin", value: "LAT" },
  { name: "Finance &amp; Com Law - Law", value: "LAW" },
  { name: "Literacy Studies", value: "LS" },
  { name: "Mathematics", value: "MATH" },
  { name: "Master of Business Admin", value: "MBA" },
  { name: "Medical Science", value: "MDSC" },
  { name: "Medieval Studies", value: "MDVL" },
  { name: "Mechanical Engineering", value: "ME" },
  { name: "Management", value: "MGMT" },
  { name: "Marketing", value: "MKTG" },
  { name: "Master of Public Health", value: "MPH" },
  { name: "Military Science", value: "MSL" },
  { name: "Music", value: "MUS" },
  { name: "Nursing, School of", value: "NUR" },
  { name: "Occupational Therapy", value: "O T" },
  { name: "Organizational Chng&amp;Leadership", value: "OCL" },
  { name: "Public Administration", value: "PADM" },
  { name: "Paper Engineering", value: "PAPR" },
  { name: "Public Health", value: "PH" },
  { name: "Philosophy", value: "PHIL" },
  { name: "Physics", value: "PHYS" },
  { name: "Political Science", value: "PSCI" },
  { name: "Psychology", value: "PSY" },
  { name: "Physical Therapy", value: "PT" },
  { name: "Religion, Comparative", value: "REL" },
  { name: "Science Education", value: "SCI" },
  { name: "Supply Chain Management", value: "SCM" },
  { name: "American Sign Language", value: "SIGN" },
  { name: "Speech, Language &amp; Hearing Sci", value: "SLHS" },
  { name: "Sociology", value: "SOC" },
  { name: "Spanish", value: "SPAN" },
  { name: "Special Education", value: "SPED" },
  { name: "Statistics", value: "STAT" },
  { name: "Social Work", value: "SWRK" },
  { name: "Teaching English Learners", value: "TEL" },
  { name: "Theatre", value: "THEA" },
  { name: "University Curriculum", value: "UNIV" },
  { name: "Workforce Educ &amp; Development", value: "WFED" },
];

const academicLevels = [
  "Freshmen",
  "Graduate",
  "Juniors",
  "Seniors",
  "Sophomores",
];
const grad_and_undergrad_majors = [
  "Accountancy—BBA",
  "Accountancy—MSA",
  "Acting—BFA",
  "Adapted Physical Education and Positive Behavioral Intervention and Supports—Certificate",
  "Addiction Specialization—Certificate",
  "Advertising and Promotion—BBA",
  "Aerospace Engineering—Accelerated MS, MS",
  "Aerospace Engineering—BSE",
  "African American and African Studies—BA",
  "Aging Studies—Certificate",
  "Aircraft Dispatching and Scheduling—Certificate",
  "Airport Management—Certificate",
  "Anthropology—BA",
  "Anthropology—MA (suspended)",
  "Applied Economics—Accelerated MA, MA, PhD",
  "Applied Hydrogeology—Certificate",
  "Applied Statistics—Certificate",
  "Applied and Computational Mathematics—MS",
  "Art Education—BFA",
  "Art History—BA",
  "Art: Kinetic Imaging—BS",
  "Arts Administration—BA",
  "Art—BA, BFA",
  "Assistive Technology for Individuals with Blindness or Visual Impairment—Certificate",
  "Audiology—Accelerated AuD, AuD",
  "Aviation Administration—Certificate",
  "Aviation Flight Science—BS",
  "Aviation Management and Operations—BS",
  "Aviation Technical Operations—BS",
  "Biochemistry—BS",
  "Biological Sciences—Accelerated MA, Accelerated MS, MA, MS, PhD",
  "Biology—BS",
  "Biomedical Sciences—BS",
  "Biostatistics—Certificate",
  "Business Administration—MBA",
  "Business Analytics—BBA",
  "Business Analytics—Certificate",
  "Business Education—BS",
  "Business Law—BBA",
  "Business-Oriented Chemistry—BS",
  "Business—pre-BBA",
  "Ceramics—MFA",
  "Chemical Engineering—Accelerated MS, MS, PhD",
  "Chemical Engineering—BSE",
  "Chemistry: ACS Certified—BS",
  "Chemistry—Accelerated MA, MA, MS, PhD",
  "Chemistry—BS",
  "Child Development and Services—BS",
  "Child Welfare—Certificate",
  "Child and Family Development—BS",
  "Civil Engineering—Accelerated MS, MS, PhD",
  "Civil Engineering—BSE",
  "Climate Change Policy and Management—Certificate",
  "Clinical Addiction—Certificate",
  "Clinical Mental Health Counseling—MA",
  "College Science Teaching—Certificate",
  "Communication Studies—BA",
  "Communication—Accelerated MA, MA",
  "Community and Regional Planning—BS",
  "Comparative Religion—Accelerated MA, MA",
  "Computer Engineering—Accelerated MSE, MSE",
  "Computer Engineering—BSE",
  "Computer Information Systems—BBA",
  "Computer Science—Accelerated MS, MS, PhD",
  "Computer Science—BS",
  "Construction Engineering—BSE",
  "Counseling Psychology—Certificate, Accelerated MA, MA, PhD",
  "Counselor Education—PhD",
  "Creative Writing—MFA",
  "Creative Writing—PhD",
  "Criminal Justice Studies—BA",
  "Criminal Justice Studies—MA",
  "Cultural and Environmental Heritage Management—Certificate",
  "Cybersecurity—BS",
  "Cybersecurity—MS",
  "Dance Studio Management—Certificate",
  "Dance—BA, BFA",
  "Data Science—Accelerated MS, MS",
  "Data Science—BS",
  "Digital Marketing—BBA",
  "Digital Media and Journalism—BA",
  "Diversity and Inclusion—Certificate",
  "Early Childhood General and Special Education and Lower Elementary—BS",
  "Early Childhood General and Special Education: Birth through Kindergarten—BS",
  "Early Childhood Special Education—Certificate",
  "Earth Science—Accelerated MS, MS",
  "Earth Science—BS",
  "Economics in Business—BBA",
  "Economics—BA, BS",
  "Education and Human Development—BS",
  "Education and Human Development—PhD",
  "Educational Leadership—Certificate, MA, EdS, PhD",
  "Educational and Instructional Technology—Certificate, MA",
  "Electrical Engineering—Accelerated MSE, MSE",
  "Electrical Engineering—BSE",
  "Electrical and Computer Engineering—PhD",
  "Elementary Education PK-3 and Teaching English to Speakers of Other Languages (TESOL) K-12—BS",
  "Elementary Education—BS",
  "Embedded System Design—Certificate",
  "Engineering Design Technology—BS",
  "Engineering Management Technology—BS",
  "Engineering Management—MS",
  "Engineering and Applied Sciences—PhD",
  "English as a Second Language—Certificate",
  "English: Creative Writing—BA",
  "English: Literature and Language—BA",
  "English: Rhetoric and Writing Studies—BA",
  "English—Accelerated MA, MA, PhD",
  "Environmental Geography—BS",
  "Environmental Geology—BS",
  "Environmental and Sustainability Studies—BA, BS",
  "Evaluation (Interdisciplinary)—PhD",
  "Evaluation, Measurement and Research—MA, PhD",
  "Evaluation—Certificate",
  "Event Management—BS",
  "Exercise Science—Accelerated MS, MS",
  "Exercise Science—BS",
  "Family Science and Services—BS",
  "Family and Consumer Sciences Teacher Education—BS",
  "Family and Consumer Sciences—Accelerated MA, MA",
  "Fashion Design and Development—BS",
  "Fashion Merchandising—BS",
  "Film, Video and Media Studies—BA",
  "Finance Technology—Certificate",
  "Finance—BBA",
  "Finance—MSF",
  "Food Marketing—BBA",
  "Food Marketing—Certificate",
  "French—BA",
  "Freshwater Science and Sustainability—BS",
  "Gender and Women’s Studies—BA",
  "Geochemistry—BS",
  "Geographic Information Science—Certificate",
  "Geography—Accelerated MS, MS",
  "Geology—BS",
  "Geophysics—BS",
  "Geosciences—MS, PhD",
  "Geospatial Applications of Unoccupied Aircraft Systems—Certificate",
  "German—BA",
  "Global Leadership and Learning—Certificate, MA",
  "Global and International Studies—BA",
  "Graphic Design—BFA",
  "Health Administration—BS",
  "Health and Wellness Coaching Skills—Certificate",
  "Healthcare Services and Sciences—BS",
  "Higher Education and Student Affairs—Certificate",
  "Hispanic Studies—Accelerated MA, MA",
  "History—Accelerated MA, Certificate, MA, PhD",
  "History—BA",
  "Holism and Contemplative Health Care—Certificate",
  "Human Resource Management—BBA",
  "Hydrogeology—BS",
  "Hydrogeology—Certificate",
  "Industrial Engineering—Accelerated MSE, MSE, PhD",
  "Industrial Technology Education: Non-Vocational—BS",
  "Industrial Technology Educational: Vocational—BS",
  "Industrial and Entrepreneurial Engineering—BSE",
  "Initial Teacher Certification—Certificate",
  "Integrated Business Administration—BBA",
  "Integrated Design and Manufacturing—Certificate",
  "Integrated Science—BS",
  "Interdisciplinary Health Sciences—PhD",
  "Interdisciplinary Studies—PhD",
  "Interior Architecture and Design—BS",
  "International Development Administration—MIDA",
  "Interpersonal Communication—BA ",
  "Japanese—BA",
  "Kinship Care Families—Certificate",
  "Latin—BA",
  "Law—LLM",
  "Leadership and Business Strategy—BBA",
  "Leadership and Teamwork—Certificate",
  "Literacy Studies—MA",
  "Manufacturing Engineering Technology—BS",
  "Manufacturing Engineering—Accelerated MS, MS",
  "Marketing—BBA",
  "Marriage, Couple and Family Counseling—MA",
  "Mathematics Education—MA, PhD",
  "Mathematics—Accelerated MA, MA, PhD",
  "Mathematics—BA, BS",
  "Mechanical Engineering—Accelerated MSE, MSE, PhD",
  "Mechanical Engineering—BSE",
  "Media and Technology—Certificate",
  "Medicine and Business Administration: Healthcare—MD and MBA",
  "Medicine—MD",
  "Medieval Studies—Accelerated MA, MA",
  "Mindfulness and Centering Skills—Certificate",
  "Mixed-Methods Research—Certificate",
  "Multimedia Arts Technology—Music—BS",
  "Music Composition—BM",
  "Music Education: Choral/General—BM",
  "Music Education: Instrumental—BM",
  "Music Performance: Instrumental—BM",
  "Music Performance: Keyboard—BM",
  "Music Performance: Vocal—BM",
  "Music Performance—Certificate",
  "Music Therapy Equivalency—Certificate",
  "Music Therapy—BM",
  "Music: Jazz Studies—BM",
  "Musical Arts—BMA",
  "Music—Accelerated MA, MA, MM",
  "Music—BA",
  "Nurse Educator—Certificate",
  "Nursing—BSN",
  "Nursing—MSN",
  "Nutrition and Dietetics—BS",
  "Nutrition and Dietetics—MS",
  "Occupational Education Studies—BS",
  "Occupational Therapy Assistant—BS",
  "Occupational Therapy Assistant—OTD",
  "Organizational Change Leadership—Certificate, MA, PhD",
  "Orientation and Mobility for Children—MA",
  "Orientation and Mobility—Certificate, Accelerated MA, MA",
  "Paper Engineering—BSE, Certificate",
  "Paper and Printing Science—Accelerated MS, MS, PhD",
  "Personal Financial Planning—BBA",
  "Philosophy—BA",
  "Philosophy—MA",
  "Physical Education—MA",
  "Physical Therapy—DPT",
  "Physical and Health Education Teacher Education: K-12—BS",
  "Physician Assistant—MSM",
  "Physics—BS",
  "Physics—MA, PhD",
  "Political Science—Accelerated MA, MA, PhD",
  "Political Science—BA",
  "Positive Behavioral Intervention and Supports—Certificate",
  "Pre-Dentistry",
  "Pre-Law",
  "Pre-Medicine",
  "Pre-Secondary Education",
  "Product Design—BFA",
  "Professional Workforce Educator—Certificate",
  "Psychology—BS",
  "Psychology—MA, PhD",
  "Public Administration—Accelerated MPA, MPA, PhD",
  "Public Health—BS",
  "Public Health—MPH",
  "Public History—Accelerated MA, MA",
  "Public History—BA",
  "Public Relations—Certificate",
  "Public and Nonprofit Administration—BS",
  "Qualitative Research—Certificate",
  "Recreation Management—BS",
  "Rehabilitation Counseling—MA",
  "Religion—BA",
  "Renewable Power Systems—Certificate",
  "Resiliency and Well-Being Skills—Certificate",
  "Sales and Business Marketing—BBA",
  "School Administration: Central Office Endorsement—Certificate",
  "School Counseling—Certificate, MA",
  "Science Education—MA, PhD",
  "Social Psychology—BA",
  "Social Studies—BA",
  "Social Work—Accelerated MSW, MSW",
  "Social Work—BSW",
  "Sociology—Accelerated MA, MA, PhD",
  "Sociology—BA",
  "Spanish—BA",
  "Spanish—PhD",
  "Special Education Learning Disabilities K-12 and Elementary Education PK-3—BS",
  "Special Education—MA, Master Teacher-Accelerated MA, EdD",
  "Speech, Language and Hearing Sciences—BS, Certificate",
  "Speech-Language Pathology—MA",
  "Spirituality, Culture and Health—Certificate, MA",
  "Sport Management—BS",
  "Sport Management—MA",
  "Sports Coaching—MA",
  "Stage Management—BFA",
  "Statistics—Accelerated MS, MS, PhD",
  "Statistics—BS",
  "Strategic Communication—BA",
  "Supply Chain Management—BBA",
  "Supply Chain Management—Certificate",
  "Sustainable Brewing—BS",
  "Teacher Development—Certificate",
  "Teaching Children with Visual Impairments/Orientation and Mobility—Dual MA",
  "Teaching Children with Visual Impairments—MA",
  "Teaching English to Speakers of Other Languages —Accelerated MA, MA",
  "Teaching and Learning Mathematics—BA, BS",
  "Teaching, Learning and Educational Studies—MA",
  "Teaching—MA",
  "Theatre Design and Technical Production—BFA",
  "Theatre: Music Theatre Performance—BFA",
  "Tourism and Travel—BA",
  "Tribal Governance—Certificate",
  "UAVs Applications in Geological and Environmental Sciences—Certificate",
  "University Curriculum (Exploratory Advising)",
  "University Studies—BA, BS",
  "Unmanned Arial Systems Operations—Certificate",
  "Urban, Geographic Information Science—BS",
  "Urban, Regional and Environmental Planning—BS",
  "Vision Certificate for Teachers—Certificate",
  "Vision Rehabilitation Therapy—Certificate, Accelerated MA, MA",
  "Workforce Education and Development—Accelerated MA, MA",
  "Workforce Education and Development—BA",
  "Youth and Community Development—BS",
  "Youth and Community Development—Certificate",
];

export {
  sdgs,
  skills_and_interests,
  PARTICIPATION_STATUS,
  majors,
  academicLevels,
  grad_and_undergrad_majors,
};
