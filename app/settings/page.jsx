// app/settings/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';

// Translations object for all languages
const translations = {
  english: {
    // Header
    settingsTitle: 'Settings',
    settingsSubtitle: 'Manage your account settings and preferences',
    
    // Tabs
    tabGeneral: 'General',
    tabVault: 'Vault',
    tabNotifications: 'Notifications',
    tabSecurity: 'Security',
    tabPrivacy: 'Privacy',
    tabBilling: 'Billing',
    
    // General Settings
    generalSettings: 'General Settings',
    language: 'Language',
    currency: 'Currency',
    timeZone: 'Time Zone',
    darkMode: 'Dark Mode',
    darkModeDesc: 'Use dark theme across the app',
    
    // Vault Settings
    vaultTitle: 'Income Smoothing Vault™',
    currentVaultBalance: 'Current Vault Balance',
    autoSaveVault: 'Auto-Save to Vault',
    autoSaveVaultDesc: 'Automatically save a percentage of your income',
    vaultSavingsPercentage: 'Vault Savings Percentage',
    basedOnAvgIncome: 'Based on your average monthly income of',
    youllSaveApprox: "You'll save approximately",
    perMonth: 'per month',
    vaultWithdrawalRules: 'Vault Withdrawal Rules',
    instantWithdrawals: 'Instant withdrawals for emergencies',
    noPenalties: 'No penalties or fees',
    earnReturns: 'Earn up to 7% annual returns',
    
    // Notification Settings
    notificationPreferences: 'Notification Preferences',
    emailNotifications: 'Email Notifications',
    emailNotificationsDesc: 'Receive updates via email',
    smsAlerts: 'SMS Alerts',
    smsAlertsDesc: 'Get SMS for important updates',
    pushNotifications: 'Push Notifications',
    pushNotificationsDesc: 'In-app and browser notifications',
    agentAlerts: 'Agent Alerts',
    agentAlertsDesc: 'Real-time alerts from AI agents',
    marketingEmails: 'Marketing Emails',
    marketingEmailsDesc: 'Promotional offers and updates',
    notificationSchedule: 'Notification Schedule',
    quietHours: 'Quiet Hours',
    to: 'to',
    
    // Security Settings
    securitySettings: 'Security Settings',
    enhanceSecurity: 'Enhance Your Security',
    enableTwoFactor: 'Enable two-factor authentication for better protection',
    twoFactorAuth: 'Two-Factor Authentication',
    twoFactorAuthDesc: 'Add an extra layer of security',
    biometricLogin: 'Biometric Login',
    biometricLoginDesc: 'Use fingerprint or face recognition',
    passwordAuth: 'Password & Authentication',
    changePassword: 'Change Password',
    manageDevices: 'Manage Devices',
    viewLoginHistory: 'View Login History',
    activeSessions: 'Active Sessions',
    current: 'Current',
    endSession: 'End Session',
    chromeWindows: 'Chrome on Windows',
    kamaiApp: 'Kamai App on Android',
    now: 'Now',
    hoursAgo: 'hours ago',
    
    // Privacy Settings
    privacySettings: 'Privacy Settings',
    dataSharing: 'Data Sharing',
    dataSharingDesc: 'Share usage data to improve services',
    dataManagement: 'Data Management',
    downloadMyData: 'Download My Data',
    requestDataDeletion: 'Request Data Deletion',
    legalDocuments: 'Legal Documents',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    cookiePolicy: 'Cookie Policy',
    
    // Billing Settings
    billingSubscription: 'Billing & Subscription',
    currentPlan: 'Current Plan',
    active: 'Active',
    nextBillingDate: 'Next billing date',
    paymentMethod: 'Payment Method',
    expires: 'Expires',
    update: 'Update',
    addPaymentMethod: '+ Add Payment Method',
    billingHistory: 'Billing History',
    monthlySubscription: 'Monthly subscription',
    paid: 'Paid',
    viewAllInvoices: 'View All Invoices →',
    cancelSubscription: 'Cancel Subscription',
    
    // Danger Zone
    dangerZone: 'Danger Zone',
    dangerZoneDesc: 'Once you delete your account, there is no going back. Please be certain.',
    deleteAccount: 'Delete Account',
    
    // Loading
    loadingSettings: 'Loading settings...',
    settingsUpdated: '✓ Settings updated successfully',
    
    // Locations
    mumbaiIndia: 'Mumbai, India',
    delhiIndia: 'Delhi, India',
  },
  
  hindi: {
    // Header
    settingsTitle: 'सेटिंग्स',
    settingsSubtitle: 'अपने खाते की सेटिंग्स और प्राथमिकताएं प्रबंधित करें',
    
    // Tabs
    tabGeneral: 'सामान्य',
    tabVault: 'वॉल्ट',
    tabNotifications: 'सूचनाएं',
    tabSecurity: 'सुरक्षा',
    tabPrivacy: 'गोपनीयता',
    tabBilling: 'बिलिंग',
    
    // General Settings
    generalSettings: 'सामान्य सेटिंग्स',
    language: 'भाषा',
    currency: 'मुद्रा',
    timeZone: 'समय क्षेत्र',
    darkMode: 'डार्क मोड',
    darkModeDesc: 'ऐप में डार्क थीम का उपयोग करें',
    
    // Vault Settings
    vaultTitle: 'इनकम स्मूथिंग वॉल्ट™',
    currentVaultBalance: 'वर्तमान वॉल्ट शेष',
    autoSaveVault: 'वॉल्ट में स्वतः बचत',
    autoSaveVaultDesc: 'अपनी आय का एक प्रतिशत स्वचालित रूप से बचाएं',
    vaultSavingsPercentage: 'वॉल्ट बचत प्रतिशत',
    basedOnAvgIncome: 'आपकी औसत मासिक आय के आधार पर',
    youllSaveApprox: 'आप लगभग बचाएंगे',
    perMonth: 'प्रति माह',
    vaultWithdrawalRules: 'वॉल्ट निकासी नियम',
    instantWithdrawals: 'आपातकाल के लिए तत्काल निकासी',
    noPenalties: 'कोई जुर्माना या शुल्क नहीं',
    earnReturns: '7% तक वार्षिक रिटर्न अर्जित करें',
    
    // Notification Settings
    notificationPreferences: 'सूचना प्राथमिकताएं',
    emailNotifications: 'ईमेल सूचनाएं',
    emailNotificationsDesc: 'ईमेल के माध्यम से अपडेट प्राप्त करें',
    smsAlerts: 'एसएमएस अलर्ट',
    smsAlertsDesc: 'महत्वपूर्ण अपडेट के लिए एसएमएस प्राप्त करें',
    pushNotifications: 'पुश सूचनाएं',
    pushNotificationsDesc: 'इन-ऐप और ब्राउज़र सूचनाएं',
    agentAlerts: 'एजेंट अलर्ट',
    agentAlertsDesc: 'AI एजेंटों से रीयल-टाइम अलर्ट',
    marketingEmails: 'मार्केटिंग ईमेल',
    marketingEmailsDesc: 'प्रचार ऑफर और अपडेट',
    notificationSchedule: 'सूचना अनुसूची',
    quietHours: 'शांत घंटे',
    to: 'से',
    
    // Security Settings
    securitySettings: 'सुरक्षा सेटिंग्स',
    enhanceSecurity: 'अपनी सुरक्षा बढ़ाएं',
    enableTwoFactor: 'बेहतर सुरक्षा के लिए दो-कारक प्रमाणीकरण सक्षम करें',
    twoFactorAuth: 'दो-कारक प्रमाणीकरण',
    twoFactorAuthDesc: 'सुरक्षा की एक अतिरिक्त परत जोड़ें',
    biometricLogin: 'बायोमेट्रिक लॉगिन',
    biometricLoginDesc: 'फिंगरप्रिंट या फेस रिकग्निशन का उपयोग करें',
    passwordAuth: 'पासवर्ड और प्रमाणीकरण',
    changePassword: 'पासवर्ड बदलें',
    manageDevices: 'डिवाइस प्रबंधित करें',
    viewLoginHistory: 'लॉगिन इतिहास देखें',
    activeSessions: 'सक्रिय सत्र',
    current: 'वर्तमान',
    endSession: 'सत्र समाप्त करें',
    chromeWindows: 'विंडोज पर क्रोम',
    kamaiApp: 'एंड्रॉइड पर Kamai ऐप',
    now: 'अभी',
    hoursAgo: 'घंटे पहले',
    
    // Privacy Settings
    privacySettings: 'गोपनीयता सेटिंग्स',
    dataSharing: 'डेटा साझाकरण',
    dataSharingDesc: 'सेवाओं को बेहतर बनाने के लिए उपयोग डेटा साझा करें',
    dataManagement: 'डेटा प्रबंधन',
    downloadMyData: 'मेरा डेटा डाउनलोड करें',
    requestDataDeletion: 'डेटा हटाने का अनुरोध करें',
    legalDocuments: 'कानूनी दस्तावेज़',
    privacyPolicy: 'गोपनीयता नीति',
    termsOfService: 'सेवा की शर्तें',
    cookiePolicy: 'कुकी नीति',
    
    // Billing Settings
    billingSubscription: 'बिलिंग और सदस्यता',
    currentPlan: 'वर्तमान योजना',
    active: 'सक्रिय',
    nextBillingDate: 'अगली बिलिंग तिथि',
    paymentMethod: 'भुगतान विधि',
    expires: 'समाप्ति',
    update: 'अपडेट करें',
    addPaymentMethod: '+ भुगतान विधि जोड़ें',
    billingHistory: 'बिलिंग इतिहास',
    monthlySubscription: 'मासिक सदस्यता',
    paid: 'भुगतान किया',
    viewAllInvoices: 'सभी इनवॉइस देखें →',
    cancelSubscription: 'सदस्यता रद्द करें',
    
    // Danger Zone
    dangerZone: 'खतरनाक क्षेत्र',
    dangerZoneDesc: 'एक बार जब आप अपना खाता हटा देते हैं, तो वापस नहीं जा सकते। कृपया निश्चित रहें।',
    deleteAccount: 'खाता हटाएं',
    
    // Loading
    loadingSettings: 'सेटिंग्स लोड हो रही हैं...',
    settingsUpdated: '✓ सेटिंग्स सफलतापूर्वक अपडेट की गईं',
    
    // Locations
    mumbaiIndia: 'मुंबई, भारत',
    delhiIndia: 'दिल्ली, भारत',
  },
  
  tamil: {
    // Header
    settingsTitle: 'அமைப்புகள்',
    settingsSubtitle: 'உங்கள் கணக்கு அமைப்புகள் மற்றும் விருப்பங்களை நிர்வகிக்கவும்',
    
    // Tabs
    tabGeneral: 'பொது',
    tabVault: 'வால்ட்',
    tabNotifications: 'அறிவிப்புகள்',
    tabSecurity: 'பாதுகாப்பு',
    tabPrivacy: 'தனியுரிமை',
    tabBilling: 'பில்லிங்',
    
    // General Settings
    generalSettings: 'பொது அமைப்புகள்',
    language: 'மொழி',
    currency: 'நாணயம்',
    timeZone: 'நேர மண்டலம்',
    darkMode: 'இருண்ட பயன்முறை',
    darkModeDesc: 'பயன்பாடு முழுவதும் இருண்ட தீம் பயன்படுத்தவும்',
    
    // Vault Settings
    vaultTitle: 'வருமான சமன்படுத்தும் வால்ட்™',
    currentVaultBalance: 'தற்போதைய வால்ட் இருப்பு',
    autoSaveVault: 'வால்ட்டில் தானியங்கி சேமிப்பு',
    autoSaveVaultDesc: 'உங்கள் வருமானத்தின் ஒரு சதவீதத்தை தானாக சேமிக்கவும்',
    vaultSavingsPercentage: 'வால்ட் சேமிப்பு சதவீதம்',
    basedOnAvgIncome: 'உங்கள் சராசரி மாத வருமானத்தின் அடிப்படையில்',
    youllSaveApprox: 'நீங்கள் தோராயமாக சேமிப்பீர்கள்',
    perMonth: 'மாதம் ஒன்றுக்கு',
    vaultWithdrawalRules: 'வால்ட் திரும்பப் பெறும் விதிகள்',
    instantWithdrawals: 'அவசரங்களுக்கு உடனடி திரும்பப் பெறுதல்',
    noPenalties: 'அபராதங்கள் அல்லது கட்டணங்கள் இல்லை',
    earnReturns: '7% வரை ஆண்டு வருமானம் பெறுங்கள்',
    
    // Notification Settings
    notificationPreferences: 'அறிவிப்பு விருப்பங்கள்',
    emailNotifications: 'மின்னஞ்சல் அறிவிப்புகள்',
    emailNotificationsDesc: 'மின்னஞ்சல் மூலம் புதுப்பிப்புகளைப் பெறுங்கள்',
    smsAlerts: 'SMS எச்சரிக்கைகள்',
    smsAlertsDesc: 'முக்கிய புதுப்பிப்புகளுக்கு SMS பெறுங்கள்',
    pushNotifications: 'புஷ் அறிவிப்புகள்',
    pushNotificationsDesc: 'இன்-ஆப் மற்றும் உலாவி அறிவிப்புகள்',
    agentAlerts: 'ஏஜென்ட் எச்சரிக்கைகள்',
    agentAlertsDesc: 'AI ஏஜென்ட்களிடமிருந்து நிகழ்நேர எச்சரிக்கைகள்',
    marketingEmails: 'சந்தைப்படுத்தல் மின்னஞ்சல்கள்',
    marketingEmailsDesc: 'விளம்பர சலுகைகள் மற்றும் புதுப்பிப்புகள்',
    notificationSchedule: 'அறிவிப்பு அட்டவணை',
    quietHours: 'அமைதியான நேரங்கள்',
    to: 'முதல்',
    
    // Security Settings
    securitySettings: 'பாதுகாப்பு அமைப்புகள்',
    enhanceSecurity: 'உங்கள் பாதுகாப்பை மேம்படுத்துங்கள்',
    enableTwoFactor: 'சிறந்த பாதுகாப்புக்கு இரு-காரணி அங்கீகாரத்தை இயக்கவும்',
    twoFactorAuth: 'இரு-காரணி அங்கீகாரம்',
    twoFactorAuthDesc: 'கூடுதல் பாதுகாப்பு அடுக்கைச் சேர்க்கவும்',
    biometricLogin: 'பயோமெட்ரிக் உள்நுழைவு',
    biometricLoginDesc: 'கைரேகை அல்லது முக அங்கீகாரத்தைப் பயன்படுத்தவும்',
    passwordAuth: 'கடவுச்சொல் மற்றும் அங்கீகாரம்',
    changePassword: 'கடவுச்சொல்லை மாற்று',
    manageDevices: 'சாதனங்களை நிர்வகி',
    viewLoginHistory: 'உள்நுழைவு வரலாற்றைக் காண்க',
    activeSessions: 'செயலில் உள்ள அமர்வுகள்',
    current: 'தற்போதைய',
    endSession: 'அமர்வை முடி',
    chromeWindows: 'விண்டோஸில் Chrome',
    kamaiApp: 'ஆண்ட்ராய்டில் Kamai பயன்பாடு',
    now: 'இப்போது',
    hoursAgo: 'மணி நேரத்திற்கு முன்பு',
    
    // Privacy Settings
    privacySettings: 'தனியுரிமை அமைப்புகள்',
    dataSharing: 'தரவு பகிர்வு',
    dataSharingDesc: 'சேவைகளை மேம்படுத்த பயன்பாட்டு தரவைப் பகிரவும்',
    dataManagement: 'தரவு மேலாண்மை',
    downloadMyData: 'எனது தரவைப் பதிவிறக்கு',
    requestDataDeletion: 'தரவு நீக்குதலைக் கோரு',
    legalDocuments: 'சட்ட ஆவணங்கள்',
    privacyPolicy: 'தனியுரிமைக் கொள்கை',
    termsOfService: 'சேவை விதிமுறைகள்',
    cookiePolicy: 'குக்கீ கொள்கை',
    
    // Billing Settings
    billingSubscription: 'பில்லிங் மற்றும் சந்தா',
    currentPlan: 'தற்போதைய திட்டம்',
    active: 'செயலில்',
    nextBillingDate: 'அடுத்த பில்லிங் தேதி',
    paymentMethod: 'பணம் செலுத்தும் முறை',
    expires: 'காலாவதியாகிறது',
    update: 'புதுப்பி',
    addPaymentMethod: '+ பணம் செலுத்தும் முறையைச் சேர்',
    billingHistory: 'பில்லிங் வரலாறு',
    monthlySubscription: 'மாதாந்திர சந்தா',
    paid: 'செலுத்தப்பட்டது',
    viewAllInvoices: 'அனைத்து விலைப்பட்டியல்களையும் காண்க →',
    cancelSubscription: 'சந்தாவை ரத்துசெய்',
    
    // Danger Zone
    dangerZone: 'ஆபத்து மண்டலம்',
    dangerZoneDesc: 'உங்கள் கணக்கை நீக்கியவுடன், திரும்ப முடியாது. உறுதியாக இருங்கள்.',
    deleteAccount: 'கணக்கை நீக்கு',
    
    // Loading
    loadingSettings: 'அமைப்புகள் ஏற்றப்படுகின்றன...',
    settingsUpdated: '✓ அமைப்புகள் வெற்றிகரமாக புதுப்பிக்கப்பட்டன',
    
    // Locations
    mumbaiIndia: 'மும்பை, இந்தியா',
    delhiIndia: 'டெல்லி, இந்தியா',
  },
  
  telugu: {
    // Header
    settingsTitle: 'సెట్టింగ్‌లు',
    settingsSubtitle: 'మీ ఖాతా సెట్టింగ్‌లు మరియు ప్రాధాన్యతలను నిర్వహించండి',
    
    // Tabs
    tabGeneral: 'సాధారణ',
    tabVault: 'వాల్ట్',
    tabNotifications: 'నోటిఫికేషన్లు',
    tabSecurity: 'భద్రత',
    tabPrivacy: 'గోప్యత',
    tabBilling: 'బిల్లింగ్',
    
    // General Settings
    generalSettings: 'సాధారణ సెట్టింగ్‌లు',
    language: 'భాష',
    currency: 'కరెన్సీ',
    timeZone: 'టైమ్ జోన్',
    darkMode: 'డార్క్ మోడ్',
    darkModeDesc: 'యాప్ అంతటా డార్క్ థీమ్ ఉపయోగించండి',
    
    // Vault Settings
    vaultTitle: 'ఇన్‌కమ్ స్మూథింగ్ వాల్ట్™',
    currentVaultBalance: 'ప్రస్తుత వాల్ట్ బ్యాలెన్స్',
    autoSaveVault: 'వాల్ట్‌కు ఆటో-సేవ్',
    autoSaveVaultDesc: 'మీ ఆదాయంలో ఒక శాతాన్ని స్వయంచాలకంగా ఆదా చేయండి',
    vaultSavingsPercentage: 'వాల్ట్ సేవింగ్స్ శాతం',
    basedOnAvgIncome: 'మీ సగటు నెలవారీ ఆదాయం ఆధారంగా',
    youllSaveApprox: 'మీరు సుమారుగా ఆదా చేస్తారు',
    perMonth: 'నెలకు',
    vaultWithdrawalRules: 'వాల్ట్ ఉపసంహరణ నియమాలు',
    instantWithdrawals: 'అత్యవసర పరిస్థితులకు తక్షణ ఉపసంహరణలు',
    noPenalties: 'జరిమానాలు లేదా రుసుములు లేవు',
    earnReturns: '7% వార్షిక రాబడి వరకు సంపాదించండి',
    
    // Notification Settings
    notificationPreferences: 'నోటిఫికేషన్ ప్రాధాన్యతలు',
    emailNotifications: 'ఇమెయిల్ నోటిఫికేషన్లు',
    emailNotificationsDesc: 'ఇమెయిల్ ద్వారా అప్‌డేట్‌లు పొందండి',
    smsAlerts: 'SMS అలర్ట్‌లు',
    smsAlertsDesc: 'ముఖ్యమైన అప్‌డేట్‌ల కోసం SMS పొందండి',
    pushNotifications: 'పుష్ నోటిఫికేషన్లు',
    pushNotificationsDesc: 'ఇన్-యాప్ మరియు బ్రౌజర్ నోటిఫికేషన్లు',
    agentAlerts: 'ఏజెంట్ అలర్ట్‌లు',
    agentAlertsDesc: 'AI ఏజెంట్ల నుండి రియల్-టైమ్ అలర్ట్‌లు',
    marketingEmails: 'మార్కెటింగ్ ఇమెయిల్స్',
    marketingEmailsDesc: 'ప్రమోషనల్ ఆఫర్లు మరియు అప్‌డేట్‌లు',
    notificationSchedule: 'నోటిఫికేషన్ షెడ్యూల్',
    quietHours: 'నిశ్శబ్ద గంటలు',
    to: 'నుండి',
    
    // Security Settings
    securitySettings: 'భద్రతా సెట్టింగ్‌లు',
    enhanceSecurity: 'మీ భద్రతను పెంచండి',
    enableTwoFactor: 'మెరుగైన రక్షణ కోసం టూ-ఫ్యాక్టర్ ఆథెంటికేషన్ ఎనేబుల్ చేయండి',
    twoFactorAuth: 'టూ-ఫ్యాక్టర్ ఆథెంటికేషన్',
    twoFactorAuthDesc: 'అదనపు భద్రతా పొరను జోడించండి',
    biometricLogin: 'బయోమెట్రిక్ లాగిన్',
    biometricLoginDesc: 'వేలిముద్ర లేదా ముఖ గుర్తింపు ఉపయోగించండి',
    passwordAuth: 'పాస్‌వర్డ్ & ఆథెంటికేషన్',
    changePassword: 'పాస్‌వర్డ్ మార్చండి',
    manageDevices: 'పరికరాలను నిర్వహించండి',
    viewLoginHistory: 'లాగిన్ చరిత్ర చూడండి',
    activeSessions: 'యాక్టివ్ సెషన్లు',
    current: 'ప్రస్తుత',
    endSession: 'సెషన్ ముగించండి',
    chromeWindows: 'విండోస్‌లో Chrome',
    kamaiApp: 'ఆండ్రాయిడ్‌లో Kamai యాప్',
    now: 'ఇప్పుడు',
    hoursAgo: 'గంటల క్రితం',
    
    // Privacy Settings
    privacySettings: 'గోప్యతా సెట్టింగ్‌లు',
    dataSharing: 'డేటా షేరింగ్',
    dataSharingDesc: 'సేవలను మెరుగుపరచడానికి వినియోగ డేటాను షేర్ చేయండి',
    dataManagement: 'డేటా మేనేజ్‌మెంట్',
    downloadMyData: 'నా డేటా డౌన్‌లోడ్ చేయండి',
    requestDataDeletion: 'డేటా తొలగింపు అభ్యర్థించండి',
    legalDocuments: 'చట్టపరమైన పత్రాలు',
    privacyPolicy: 'గోప్యతా విధానం',
    termsOfService: 'సేవా నిబంధనలు',
    cookiePolicy: 'కుకీ విధానం',
    
    // Billing Settings
    billingSubscription: 'బిల్లింగ్ & సబ్‌స్క్రిప్షన్',
    currentPlan: 'ప్రస్తుత ప్లాన్',
    active: 'యాక్టివ్',
    nextBillingDate: 'తదుపరి బిల్లింగ్ తేదీ',
    paymentMethod: 'చెల్లింపు పద్ధతి',
    expires: 'గడువు ముగుస్తుంది',
    update: 'అప్‌డేట్',
    addPaymentMethod: '+ చెల్లింపు పద్ధతి జోడించండి',
    billingHistory: 'బిల్లింగ్ చరిత్ర',
    monthlySubscription: 'నెలవారీ సబ్‌స్క్రిప్షన్',
    paid: 'చెల్లించబడింది',
    viewAllInvoices: 'అన్ని ఇన్‌వాయిస్‌లు చూడండి →',
    cancelSubscription: 'సబ్‌స్క్రిప్షన్ రద్దు చేయండి',
    
    // Danger Zone
    dangerZone: 'ప్రమాద జోన్',
    dangerZoneDesc: 'మీ ఖాతాను తొలగించిన తర్వాత, వెనక్కి వెళ్ళడం సాధ్యం కాదు. దయచేసి ఖచ్చితంగా ఉండండి.',
    deleteAccount: 'ఖాతా తొలగించండి',
    
    // Loading
    loadingSettings: 'సెట్టింగ్‌లు లోడ్ అవుతున్నాయి...',
    settingsUpdated: '✓ సెట్టింగ్‌లు విజయవంతంగా అప్‌డేట్ చేయబడ్డాయి',
    
    // Locations
    mumbaiIndia: 'ముంబై, భారతదేశం',
    delhiIndia: 'ఢిల్లీ, భారతదేశం',
  },
  
  kannada: {
    // Header
    settingsTitle: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    settingsSubtitle: 'ನಿಮ್ಮ ಖಾತೆ ಸೆಟ್ಟಿಂಗ್‌ಗಳು ಮತ್ತು ಆದ್ಯತೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ',
    
    // Tabs
    tabGeneral: 'ಸಾಮಾನ್ಯ',
    tabVault: 'ವಾಲ್ಟ್',
    tabNotifications: 'ಅಧಿಸೂಚನೆಗಳು',
    tabSecurity: 'ಭದ್ರತೆ',
    tabPrivacy: 'ಗೌಪ್ಯತೆ',
    tabBilling: 'ಬಿಲ್ಲಿಂಗ್',
    
    // General Settings
    generalSettings: 'ಸಾಮಾನ್ಯ ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    language: 'ಭಾಷೆ',
    currency: 'ಕರೆನ್ಸಿ',
    timeZone: 'ಸಮಯ ವಲಯ',
    darkMode: 'ಡಾರ್ಕ್ ಮೋಡ್',
    darkModeDesc: 'ಅಪ್ಲಿಕೇಶನ್‌ನಾದ್ಯಂತ ಡಾರ್ಕ್ ಥೀಮ್ ಬಳಸಿ',
    
    // Vault Settings
    vaultTitle: 'ಆದಾಯ ಸಮತೋಲನ ವಾಲ್ಟ್™',
    currentVaultBalance: 'ಪ್ರಸ್ತುತ ವಾಲ್ಟ್ ಬ್ಯಾಲೆನ್ಸ್',
    autoSaveVault: 'ವಾಲ್ಟ್‌ಗೆ ಸ್ವಯಂ-ಉಳಿತಾಯ',
    autoSaveVaultDesc: 'ನಿಮ್ಮ ಆದಾಯದ ಶೇಕಡಾವಾರು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಉಳಿಸಿ',
    vaultSavingsPercentage: 'ವಾಲ್ಟ್ ಉಳಿತಾಯ ಶೇಕಡಾ',
    basedOnAvgIncome: 'ನಿಮ್ಮ ಸರಾಸರಿ ಮಾಸಿಕ ಆದಾಯದ ಆಧಾರದ ಮೇಲೆ',
    youllSaveApprox: 'ನೀವು ಸರಿಸುಮಾರು ಉಳಿಸುತ್ತೀರಿ',
    perMonth: 'ತಿಂಗಳಿಗೆ',
    vaultWithdrawalRules: 'ವಾಲ್ಟ್ ಹಿಂತೆಗೆದುಕೊಳ್ಳುವ ನಿಯಮಗಳು',
    instantWithdrawals: 'ತುರ್ತು ಪರಿಸ್ಥಿತಿಗಳಿಗೆ ತಕ್ಷಣ ಹಿಂತೆಗೆದುಕೊಳ್ಳುವಿಕೆ',
    noPenalties: 'ದಂಡಗಳು ಅಥವಾ ಶುಲ್ಕಗಳಿಲ್ಲ',
    earnReturns: '7% ವಾರ್ಷಿಕ ಆದಾಯ ಗಳಿಸಿ',
    
    // Notification Settings
    notificationPreferences: 'ಅಧಿಸೂಚನೆ ಆದ್ಯತೆಗಳು',
    emailNotifications: 'ಇಮೇಲ್ ಅಧಿಸೂಚನೆಗಳು',
    emailNotificationsDesc: 'ಇಮೇಲ್ ಮೂಲಕ ನವೀಕರಣಗಳನ್ನು ಪಡೆಯಿರಿ',
    smsAlerts: 'SMS ಎಚ್ಚರಿಕೆಗಳು',
    smsAlertsDesc: 'ಮುಖ್ಯ ನವೀಕರಣಗಳಿಗೆ SMS ಪಡೆಯಿರಿ',
    pushNotifications: 'ಪುಶ್ ಅಧಿಸೂಚನೆಗಳು',
    pushNotificationsDesc: 'ಇನ್-ಅಪ್ಲಿಕೇಶನ್ ಮತ್ತು ಬ್ರೌಸರ್ ಅಧಿಸೂಚನೆಗಳು',
    agentAlerts: 'ಏಜೆಂಟ್ ಎಚ್ಚರಿಕೆಗಳು',
    agentAlertsDesc: 'AI ಏಜೆಂಟ್‌ಗಳಿಂದ ನೈಜ-ಸಮಯದ ಎಚ್ಚರಿಕೆಗಳು',
    marketingEmails: 'ಮಾರ್ಕೆಟಿಂಗ್ ಇಮೇಲ್‌ಗಳು',
    marketingEmailsDesc: 'ಪ್ರಚಾರದ ಕೊಡುಗೆಗಳು ಮತ್ತು ನವೀಕರಣಗಳು',
    notificationSchedule: 'ಅಧಿಸೂಚನೆ ವೇಳಾಪಟ್ಟಿ',
    quietHours: 'ಶಾಂತ ಗಂಟೆಗಳು',
    to: 'ರಿಂದ',
    
    // Security Settings
    securitySettings: 'ಭದ್ರತಾ ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    enhanceSecurity: 'ನಿಮ್ಮ ಭದ್ರತೆಯನ್ನು ಹೆಚ್ಚಿಸಿ',
    enableTwoFactor: 'ಉತ್ತಮ ರಕ್ಷಣೆಗಾಗಿ ಎರಡು-ಅಂಶ ದೃಢೀಕರಣವನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ',
    twoFactorAuth: 'ಎರಡು-ಅಂಶ ದೃಢೀಕರಣ',
    twoFactorAuthDesc: 'ಹೆಚ್ಚುವರಿ ಭದ್ರತಾ ಪದರವನ್ನು ಸೇರಿಸಿ',
    biometricLogin: 'ಬಯೋಮೆಟ್ರಿಕ್ ಲಾಗಿನ್',
    biometricLoginDesc: 'ಬೆರಳಚ್ಚು ಅಥವಾ ಮುಖ ಗುರುತಿಸುವಿಕೆ ಬಳಸಿ',
    passwordAuth: 'ಪಾಸ್‌ವರ್ಡ್ ಮತ್ತು ದೃಢೀಕರಣ',
    changePassword: 'ಪಾಸ್‌ವರ್ಡ್ ಬದಲಾಯಿಸಿ',
    manageDevices: 'ಸಾಧನಗಳನ್ನು ನಿರ್ವಹಿಸಿ',
    viewLoginHistory: 'ಲಾಗಿನ್ ಇತಿಹಾಸ ವೀಕ್ಷಿಸಿ',
    activeSessions: 'ಸಕ್ರಿಯ ಅವಧಿಗಳು',
    current: 'ಪ್ರಸ್ತುತ',
    endSession: 'ಅವಧಿ ಮುಗಿಸಿ',
    chromeWindows: 'ವಿಂಡೋಸ್‌ನಲ್ಲಿ Chrome',
    kamaiApp: 'ಆಂಡ್ರಾಯ್ಡ್‌ನಲ್ಲಿ Kamai ಅಪ್ಲಿಕೇಶನ್',
    now: 'ಈಗ',
    hoursAgo: 'ಗಂಟೆಗಳ ಹಿಂದೆ',
    
    // Privacy Settings
    privacySettings: 'ಗೌಪ್ಯತಾ ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    dataSharing: 'ಡೇಟಾ ಹಂಚಿಕೆ',
    dataSharingDesc: 'ಸೇವೆಗಳನ್ನು ಸುಧಾರಿಸಲು ಬಳಕೆ ಡೇಟಾವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ',
    dataManagement: 'ಡೇಟಾ ನಿರ್ವಹಣೆ',
    downloadMyData: 'ನನ್ನ ಡೇಟಾ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ',
    requestDataDeletion: 'ಡೇಟಾ ಅಳಿಸುವಿಕೆ ವಿನಂತಿಸಿ',
    legalDocuments: 'ಕಾನೂನು ದಾಖಲೆಗಳು',
    privacyPolicy: 'ಗೌಪ್ಯತಾ ನೀತಿ',
    termsOfService: 'ಸೇವಾ ನಿಯಮಗಳು',
    cookiePolicy: 'ಕುಕೀ ನೀತಿ',
    
    // Billing Settings
    billingSubscription: 'ಬಿಲ್ಲಿಂಗ್ ಮತ್ತು ಚಂದಾದಾರಿಕೆ',
    currentPlan: 'ಪ್ರಸ್ತುತ ಯೋಜನೆ',
    active: 'ಸಕ್ರಿಯ',
    nextBillingDate: 'ಮುಂದಿನ ಬಿಲ್ಲಿಂಗ್ ದಿನಾಂಕ',
    paymentMethod: 'ಪಾವತಿ ವಿಧಾನ',
    expires: 'ಮುಕ್ತಾಯ',
    update: 'ನವೀಕರಿಸಿ',
    addPaymentMethod: '+ ಪಾವತಿ ವಿಧಾನ ಸೇರಿಸಿ',
    billingHistory: 'ಬಿಲ್ಲಿಂಗ್ ಇತಿಹಾಸ',
    monthlySubscription: 'ಮಾಸಿಕ ಚಂದಾದಾರಿಕೆ',
    paid: 'ಪಾವತಿಸಲಾಗಿದೆ',
    viewAllInvoices: 'ಎಲ್ಲಾ ಇನ್‌ವಾಯ್ಸ್‌ಗಳನ್ನು ವೀಕ್ಷಿಸಿ →',
    cancelSubscription: 'ಚಂದಾದಾರಿಕೆ ರದ್ದುಗೊಳಿಸಿ',
    
    // Danger Zone
    dangerZone: 'ಅಪಾಯ ವಲಯ',
    dangerZoneDesc: 'ನಿಮ್ಮ ಖಾತೆಯನ್ನು ಅಳಿಸಿದ ನಂತರ, ಹಿಂತಿರುಗಲು ಸಾಧ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.',
    deleteAccount: 'ಖಾತೆ ಅಳಿಸಿ',
    
    // Loading
    loadingSettings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ...',
    settingsUpdated: '✓ ಸೆಟ್ಟಿಂಗ್‌ಗಳು ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ',
    
    // Locations
    mumbaiIndia: 'ಮುಂಬೈ, ಭಾರತ',
    delhiIndia: 'ದೆಹಲಿ, ಭಾರತ',
  },
  
  malayalam: {
    // Header
    settingsTitle: 'ക്രമീകരണങ്ങൾ',
    settingsSubtitle: 'നിങ്ങളുടെ അക്കൗണ്ട് ക്രമീകരണങ്ങളും മുൻഗണനകളും നിയന്ത്രിക്കുക',
    
    // Tabs
    tabGeneral: 'പൊതുവായ',
    tabVault: 'വാൾട്ട്',
    tabNotifications: 'അറിയിപ്പുകൾ',
    tabSecurity: 'സുരക്ഷ',
    tabPrivacy: 'സ്വകാര്യത',
    tabBilling: 'ബില്ലിംഗ്',
    
    // General Settings
    generalSettings: 'പൊതു ക്രമീകരണങ്ങൾ',
    language: 'ഭാഷ',
    currency: 'കറൻസി',
    timeZone: 'സമയ മേഖല',
    darkMode: 'ഡാർക്ക് മോഡ്',
    darkModeDesc: 'ആപ്പിലുടനീളം ഡാർക്ക് തീം ഉപയോഗിക്കുക',
    
    // Vault Settings
    vaultTitle: 'ഇൻകം സ്മൂത്തിംഗ് വാൾട്ട്™',
    currentVaultBalance: 'നിലവിലെ വാൾട്ട് ബാലൻസ്',
    autoSaveVault: 'വാൾട്ടിലേക്ക് ഓട്ടോ-സേവ്',
    autoSaveVaultDesc: 'നിങ്ങളുടെ വരുമാനത്തിന്റെ ഒരു ശതമാനം സ്വയമേവ സേവ് ചെയ്യുക',
    vaultSavingsPercentage: 'വാൾട്ട് സേവിംഗ്സ് ശതമാനം',
    basedOnAvgIncome: 'നിങ്ങളുടെ ശരാശരി പ്രതിമാസ വരുമാനത്തെ അടിസ്ഥാനമാക്കി',
    youllSaveApprox: 'നിങ്ങൾ ഏകദേശം സേവ് ചെയ്യും',
    perMonth: 'പ്രതിമാസം',
    vaultWithdrawalRules: 'വാൾട്ട് പിൻവലിക്കൽ നിയമങ്ങൾ',
    instantWithdrawals: 'അടിയന്തിര ഘട്ടങ്ങളിൽ തൽക്ഷണ പിൻവലിക്കൽ',
    noPenalties: 'പിഴകളോ ഫീസോ ഇല്ല',
    earnReturns: '7% വരെ വാർഷിക വരുമാനം നേടുക',
    
    // Notification Settings
    notificationPreferences: 'അറിയിപ്പ് മുൻഗണനകൾ',
    emailNotifications: 'ഇമെയിൽ അറിയിപ്പുകൾ',
    emailNotificationsDesc: 'ഇമെയിൽ വഴി അപ്‌ഡേറ്റുകൾ സ്വീകരിക്കുക',
    smsAlerts: 'SMS അലേർട്ടുകൾ',
    smsAlertsDesc: 'പ്രധാന അപ്‌ഡേറ്റുകൾക്ക് SMS ലഭിക്കുക',
    pushNotifications: 'പുഷ് അറിയിപ്പുകൾ',
    pushNotificationsDesc: 'ഇൻ-ആപ്പ്, ബ്രൗസർ അറിയിപ്പുകൾ',
    agentAlerts: 'ഏജന്റ് അലേർട്ടുകൾ',
    agentAlertsDesc: 'AI ഏജന്റുകളിൽ നിന്നുള്ള തത്സമയ അലേർട്ടുകൾ',
    marketingEmails: 'മാർക്കറ്റിംഗ് ഇമെയിലുകൾ',
    marketingEmailsDesc: 'പ്രമോഷണൽ ഓഫറുകളും അപ്‌ഡേറ്റുകളും',
    notificationSchedule: 'അറിയിപ്പ് ഷെഡ്യൂൾ',
    quietHours: 'നിശ്ശബ്ദ മണിക്കൂറുകൾ',
    to: 'മുതൽ',
    
    // Security Settings
    securitySettings: 'സുരക്ഷാ ക്രമീകരണങ്ങൾ',
    enhanceSecurity: 'നിങ്ങളുടെ സുരക്ഷ മെച്ചപ്പെടുത്തുക',
    enableTwoFactor: 'മികച്ച സംരക്ഷണത്തിനായി ടു-ഫാക്ടർ ഓതന്റിക്കേഷൻ പ്രവർത്തനക്ഷമമാക്കുക',
    twoFactorAuth: 'ടു-ഫാക്ടർ ഓതന്റിക്കേഷൻ',
    twoFactorAuthDesc: 'അധിക സുരക്ഷാ പാളി ചേർക്കുക',
    biometricLogin: 'ബയോമെട്രിക് ലോഗിൻ',
    biometricLoginDesc: 'ഫിംഗർപ്രിന്റോ ഫേസ് റെക്കഗ്നിഷനോ ഉപയോഗിക്കുക',
    passwordAuth: 'പാസ്‌വേഡ് & ഓതന്റിക്കേഷൻ',
    changePassword: 'പാസ്‌വേഡ് മാറ്റുക',
    manageDevices: 'ഉപകരണങ്ങൾ നിയന്ത്രിക്കുക',
    viewLoginHistory: 'ലോഗിൻ ചരിത്രം കാണുക',
    activeSessions: 'സജീവ സെഷനുകൾ',
    current: 'നിലവിലെ',
    endSession: 'സെഷൻ അവസാനിപ്പിക്കുക',
    chromeWindows: 'വിൻഡോസിൽ Chrome',
    kamaiApp: 'ആൻഡ്രോയിഡിൽ Kamai ആപ്പ്',
    now: 'ഇപ്പോൾ',
    hoursAgo: 'മണിക്കൂർ മുമ്പ്',
    
    // Privacy Settings
    privacySettings: 'സ്വകാര്യതാ ക്രമീകരണങ്ങൾ',
    dataSharing: 'ഡാറ്റ പങ്കിടൽ',
    dataSharingDesc: 'സേവനങ്ങൾ മെച്ചപ്പെടുത്താൻ ഉപയോഗ ഡാറ്റ പങ്കിടുക',
    dataManagement: 'ഡാറ്റ മാനേജ്‌മെന്റ്',
    downloadMyData: 'എന്റെ ഡാറ്റ ഡൗൺലോഡ് ചെയ്യുക',
    requestDataDeletion: 'ഡാറ്റ ഇല്ലാതാക്കൽ അഭ്യർത്ഥിക്കുക',
    legalDocuments: 'നിയമ രേഖകൾ',
    privacyPolicy: 'സ്വകാര്യതാ നയം',
    termsOfService: 'സേവന നിബന്ധനകൾ',
    cookiePolicy: 'കുക്കി നയം',
    
    // Billing Settings
    billingSubscription: 'ബില്ലിംഗ് & സബ്‌സ്‌ക്രിപ്ഷൻ',
        currentPlan: 'നിലവിലെ പ്ലാൻ',
    active: 'സജീവം',
    nextBillingDate: 'അടുത്ത ബില്ലിംഗ് തീയതി',
    paymentMethod: 'പേയ്‌മെന്റ് രീതി',
    expires: 'കാലഹരണപ്പെടുന്നു',
    update: 'അപ്‌ഡേറ്റ്',
    addPaymentMethod: '+ പേയ്‌മെന്റ് രീതി ചേർക്കുക',
    billingHistory: 'ബില്ലിംഗ് ചരിത്രം',
    monthlySubscription: 'പ്രതിമാസ സബ്‌സ്‌ക്രിപ്ഷൻ',
    paid: 'അടച്ചു',
    viewAllInvoices: 'എല്ലാ ഇൻവോയ്‌സുകളും കാണുക →',
    cancelSubscription: 'സബ്‌സ്‌ക്രിപ്ഷൻ റദ്ദാക്കുക',
    
    // Danger Zone
    dangerZone: 'അപകട മേഖല',
    dangerZoneDesc: 'നിങ്ങളുടെ അക്കൗണ്ട് ഇല്ലാതാക്കിയാൽ, തിരികെ പോകാൻ കഴിയില്ല. ദയവായി ഉറപ്പാക്കുക.',
    deleteAccount: 'അക്കൗണ്ട് ഇല്ലാതാക്കുക',
    
    // Loading
    loadingSettings: 'ക്രമീകരണങ്ങൾ ലോഡ് ചെയ്യുന്നു...',
    settingsUpdated: '✓ ക്രമീകരണങ്ങൾ വിജയകരമായി അപ്‌ഡേറ്റ് ചെയ്തു',
    
    // Locations
    mumbaiIndia: 'മുംബൈ, ഇന്ത്യ',
    delhiIndia: 'ഡൽഹി, ഇന്ത്യ',
  }
};

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState({
    autoVault: true,
    vaultPercentage: 20,
    alertsEnabled: true,
    emailNotifications: true,
    smsAlerts: true,
    pushNotifications: false,
    darkMode: false,
    language: 'english',
    currency: 'INR',
    timeZone: 'Asia/Kolkata',
    twoFactorAuth: false,
    biometricLogin: false,
    dataSharing: false,
    marketingEmails: false
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  // Get current translations based on selected language
  const t = translations[preferences.language] || translations.english;

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        const demoUser = {
          _id: 'demo123',
          name: 'Rahul Kumar',
          email: 'rahul@demo.com',
          phone: '+91 98765 43210',
          workType: 'delivery',
          flexScore: 750,
          vaultBalance: 245000,
          preferences: preferences
        };
        setUser(demoUser);
        setLoading(false);
        return;
      }
      
      await fetchUser();
    };

    checkAuth();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.log('No token during fetch');
        return;
      }

      const res = await fetch('/api/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.status === 401) {
        localStorage.removeItem('authToken');
        router.push('/login');
        return;
      }
      
      const data = await res.json();
      
      if (data.success) {
        setUser(data.data);
        setPreferences(data.data.preferences || preferences);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPrefs) => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPreferences({ ...preferences, ...newPrefs });
      
      const currentT = translations[newPrefs.language || preferences.language] || translations.english;
      
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up font-medium';
      toast.textContent = currentT.settingsUpdated;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    } catch (error) {
      console.error('Error updating settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key) => {
    updatePreferences({ [key]: !preferences[key] });
  };

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar user={user} onToggleSidebar={toggleSidebar} />
      
      <div className="flex pt-16">
        <Sidebar isOpen={sidebarOpen} />
        
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
          <div className="min-h-screen">
            <div className="p-4 md:p-6 lg:p-8">
              
              {loading ? (
                <div className="flex items-center justify-center min-h-[60vh]">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/10 border-t-[#1BD4CA] mx-auto mb-4"></div>
                    <p className="text-white/80">{t.loadingSettings}</p>
                  </div>
                </div>
              ) : (
                <div className="max-w-6xl mx-auto">
                  
                  {/* Settings Header */}
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">{t.settingsTitle}</h1>
                    <p className="text-white/80">{t.settingsSubtitle}</p>
                  </div>

                  {/* Tabs Navigation */}
                  <div className="bg-[#0B0F19] border border-white/10 rounded-2xl border border-white/10 shadow-sm p-2 mb-8 inline-flex flex-wrap gap-1">
                    {[
                      { id: 'general', label: t.tabGeneral, icon: '⚙️' },
                      { id: 'vault', label: t.tabVault, icon: '💰' },
                      { id: 'notifications', label: t.tabNotifications, icon: '🔔' },
                      { id: 'security', label: t.tabSecurity, icon: '🔒' },
                      { id: 'privacy', label: t.tabPrivacy, icon: '🛡️' },
                      { id: 'billing', label: t.tabBilling, icon: '💳' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                          activeTab === tab.id
                            ? 'bg-gray-900 dark:bg-[#1BD4CA] text-white shadow-sm'
                            : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="space-y-6">
                    
                    {/* General Settings */}
                    {activeTab === 'general' && (
                      <div className="bg-[#0B0F19] border border-white/10 rounded-2xl border border-white/10 shadow-sm p-8">
                        <h2 className="text-2xl font-bold text-white mb-6">{t.generalSettings}</h2>
                        
                        <div className="space-y-6 max-w-2xl">
                          <div>
                            <label className="block text-sm font-semibold text-white/90 mb-2">{t.language}</label>
                            <select
                              value={preferences.language}
                              onChange={(e) => updatePreferences({ language: e.target.value })}
                              className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option className="bg-[#0B0F19] text-white" value="english">English</option>
                              <option className="bg-[#0B0F19] text-white" value="hindi">हिंदी</option>
                              <option className="bg-[#0B0F19] text-white" value="tamil">தமிழ்</option>
                              <option className="bg-[#0B0F19] text-white" value="telugu">తెలుగు</option>
                              <option className="bg-[#0B0F19] text-white" value="kannada">ಕನ್ನಡ</option>
                              <option className="bg-[#0B0F19] text-white" value="malayalam">മലയാളം</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-white/90 mb-2">{t.currency}</label>
                            <select
                              value={preferences.currency}
                              onChange={(e) => updatePreferences({ currency: e.target.value })}
                              className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option className="bg-[#0B0F19] text-white" value="INR">₹ INR - Indian Rupee</option>
                              <option className="bg-[#0B0F19] text-white" value="USD">$ USD - US Dollar</option>
                              <option className="bg-[#0B0F19] text-white" value="EUR">€ EUR - Euro</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-white/90 mb-2">{t.timeZone}</label>
                            <select
                              value={preferences.timeZone}
                              onChange={(e) => updatePreferences({ timeZone: e.target.value })}
                              className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option className="bg-[#0B0F19] text-white" value="Asia/Kolkata">India (GMT+5:30)</option>
                              <option className="bg-[#0B0F19] text-white" value="Asia/Dubai">Dubai (GMT+4:00)</option>
                              <option className="bg-[#0B0F19] text-white" value="Europe/London">London (GMT+0:00)</option>
                              <option className="bg-[#0B0F19] text-white" value="America/New_York">New York (GMT-5:00)</option>
                            </select>
                          </div>

                          <div className="flex items-center justify-between py-4 border-t border-white/10">
                            <div>
                              <p className="font-semibold text-white">{t.darkMode}</p>
                              <p className="text-sm text-white/60">{t.darkModeDesc}</p>
                            </div>
                            <button
                              onClick={() => handleToggle('darkMode')}
                              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                                preferences.darkMode ? 'bg-[#1BD4CA]' : 'bg-white/10'
                              }`}
                            >
                              <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                                  preferences.darkMode ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Vault Settings */}
                    {activeTab === 'vault' && (
                      <div className="bg-[#0B0F19] border border-white/10 rounded-2xl border border-white/10 shadow-sm p-8">
                        <h2 className="text-2xl font-bold text-white mb-6">{t.vaultTitle}</h2>
                        
                        <div className="space-y-6 max-w-2xl">
                          <div className="bg-[#1BD4CA]/10 border border-[#1BD4CA]/20 rounded-xl p-4 mb-6">
                            <p className="text-[#1BD4CA] font-semibold mb-1">{t.currentVaultBalance}</p>
                            <p className="text-3xl font-bold text-[#1BD4CA]">₹{(user?.vaultBalance || 245000).toLocaleString()}</p>
                          </div>

                          <div className="flex items-center justify-between py-4">
                            <div>
                              <p className="font-semibold text-white">{t.autoSaveVault}</p>
                              <p className="text-sm text-white/60">{t.autoSaveVaultDesc}</p>
                            </div>
                            <button
                              onClick={() => handleToggle('autoVault')}
                              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                                preferences.autoVault ? 'bg-[#1BD4CA]' : 'bg-white/10'
                              }`}
                            >
                              <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                                  preferences.autoVault ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>

                          {preferences.autoVault && (
                            <div className="space-y-4 p-4 bg-white/5 rounded-xl">
                              <div>
                                <div className="flex justify-between mb-2">
                                  <label className="text-sm font-semibold text-white/90">
                                    {t.vaultSavingsPercentage}
                                  </label>
                                  <span className="text-2xl font-bold text-[#1BD4CA]">{preferences.vaultPercentage}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="5"
                                  max="50"
                                  step="5"
                                  value={preferences.vaultPercentage || 20}
                                  onChange={(e) => setPreferences({
                                    ...preferences,
                                    vaultPercentage: parseInt(e.target.value)
                                  })}
                                  onMouseUp={(e) => updatePreferences({
                                    vaultPercentage: parseInt(e.target.value)
                                  })}
                                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#1BD4CA]"
                                />
                                <div className="flex justify-between text-xs text-white/60 mt-2">
                                  <span>5%</span>
                                  <span>25%</span>
                                  <span>50%</span>
                                </div>
                              </div>

                              <div className="pt-4 border-t border-white/10">
                                <p className="text-sm text-white/80 mb-2">{t.basedOnAvgIncome} ₹65,000:</p>
                                <p className="text-lg font-semibold text-white">
                                  {t.youllSaveApprox} ₹{((65000 * preferences.vaultPercentage) / 100).toLocaleString()} {t.perMonth}
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="space-y-4 pt-6 border-t border-white/10">
                            <h3 className="font-semibold text-white">{t.vaultWithdrawalRules}</h3>
                            <div className="space-y-3 text-sm">
                              <div className="flex items-start gap-2">
                                <span className="text-green-400 mt-0.5">✓</span>
                                <span className="text-white/80">{t.instantWithdrawals}</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-green-400 mt-0.5">✓</span>
                                <span className="text-white/80">{t.noPenalties}</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-green-400 mt-0.5">✓</span>
                                <span className="text-white/80">{t.earnReturns}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Notification Settings */}
                    {activeTab === 'notifications' && (
                      <div className="bg-[#0B0F19] border border-white/10 rounded-2xl border border-white/10 shadow-sm p-8">
                        <h2 className="text-2xl font-bold text-white mb-6">{t.notificationPreferences}</h2>
                        
                        <div className="space-y-6 max-w-2xl">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between py-4">
                              <div>
                                <p className="font-semibold text-white">{t.emailNotifications}</p>
                                <p className="text-sm text-white/60">{t.emailNotificationsDesc}</p>
                              </div>
                              <button
                                onClick={() => handleToggle('emailNotifications')}
                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                                  preferences.emailNotifications ? 'bg-[#1BD4CA]' : 'bg-white/10'
                                }`}
                              >
                                <span
                                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                                    preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>

                            <div className="flex items-center justify-between py-4">
                              <div>
                                <p className="font-semibold text-white">{t.smsAlerts}</p>
                                <p className="text-sm text-white/60">{t.smsAlertsDesc}</p>
                              </div>
                              <button
                                onClick={() => handleToggle('smsAlerts')}
                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                                  preferences.smsAlerts ? 'bg-[#1BD4CA]' : 'bg-white/10'
                                }`}
                              >
                                <span
                                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                                    preferences.smsAlerts ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>

                            <div className="flex items-center justify-between py-4">
                              <div>
                                <p className="font-semibold text-white">{t.pushNotifications}</p>
                                <p className="text-sm text-white/60">{t.pushNotificationsDesc}</p>
                              </div>
                              <button
                                onClick={() => handleToggle('pushNotifications')}
                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                                  preferences.pushNotifications ? 'bg-[#1BD4CA]' : 'bg-white/10'
                                }`}
                              >
                                <span
                                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                                    preferences.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>

                            <div className="flex items-center justify-between py-4">
                              <div>
                                <p className="font-semibold text-white">{t.agentAlerts}</p>
                                <p className="text-sm text-white/60">{t.agentAlertsDesc}</p>
                              </div>
                              <button
                                onClick={() => handleToggle('alertsEnabled')}
                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                                  preferences.alertsEnabled ? 'bg-[#1BD4CA]' : 'bg-white/10'
                                }`}
                              >
                                <span
                                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                                    preferences.alertsEnabled ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>

                            <div className="flex items-center justify-between py-4">
                              <div>
                                <p className="font-semibold text-white">{t.marketingEmails}</p>
                                <p className="text-sm text-white/60">{t.marketingEmailsDesc}</p>
                              </div>
                              <button
                                onClick={() => handleToggle('marketingEmails')}
                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                                  preferences.marketingEmails ? 'bg-[#1BD4CA]' : 'bg-white/10'
                                }`}
                              >
                                <span
                                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                                    preferences.marketingEmails ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>
                          </div>

                          <div className="pt-6 border-t border-white/10">
                            <h3 className="font-semibold text-white mb-4">{t.notificationSchedule}</h3>
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm font-semibold text-white/90 mb-2">{t.quietHours}</label>
                                <div className="flex gap-3">
                                  <input
                                    type="time"
                                    defaultValue="22:00"
                                    className="px-3 py-2 border border-white/20 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                  <span className="self-center text-white/80">{t.to}</span>
                                  <input
                                    type="time"
                                    defaultValue="08:00"
                                    className="px-3 py-2 border border-white/20 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Security Settings */}
                    {activeTab === 'security' && (
                      <div className="bg-[#0B0F19] border border-white/10 rounded-2xl border border-white/10 shadow-sm p-8">
                        <h2 className="text-2xl font-bold text-white mb-6">{t.securitySettings}</h2>
                        
                        <div className="space-y-6 max-w-2xl">
                          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
                            <div className="flex items-start gap-3">
                              <span className="text-2xl">⚠️</span>
                              <div>
                                <p className="font-semibold text-yellow-400 mb-1">{t.enhanceSecurity}</p>
                                <p className="text-sm text-yellow-300">{t.enableTwoFactor}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between py-4">
                            <div>
                              <p className="font-semibold text-white">{t.twoFactorAuth}</p>
                              <p className="text-sm text-white/60">{t.twoFactorAuthDesc}</p>
                            </div>
                            <button
                              onClick={() => handleToggle('twoFactorAuth')}
                              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                                preferences.twoFactorAuth ? 'bg-[#1BD4CA]' : 'bg-white/10'
                              }`}
                            >
                              <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                                  preferences.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center justify-between py-4">
                            <div>
                              <p className="font-semibold text-white">{t.biometricLogin}</p>
                              <p className="text-sm text-white/60">{t.biometricLoginDesc}</p>
                            </div>
                            <button
                              onClick={() => handleToggle('biometricLogin')}
                              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                                preferences.biometricLogin ? 'bg-[#1BD4CA]' : 'bg-white/10'
                              }`}
                            >
                              <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                                  preferences.biometricLogin ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>

                          <div className="pt-6 border-t border-white/10">
                            <h3 className="font-semibold text-white mb-4">{t.passwordAuth}</h3>
                            <div className="space-y-3">
                              <button className="w-full px-4 py-3 bg-white/5 text-white/90 rounded-xl hover:bg-white/10 transition text-left font-medium">
                                {t.changePassword}
                              </button>
                              <button className="w-full px-4 py-3 bg-white/5 text-white/90 rounded-xl hover:bg-white/10 transition text-left font-medium">
                                {t.manageDevices}
                              </button>
                              <button className="w-full px-4 py-3 bg-white/5 text-white/90 rounded-xl hover:bg-white/10 transition text-left font-medium">
                                {t.viewLoginHistory}
                              </button>
                            </div>
                          </div>

                          <div className="pt-6 border-t border-white/10">
                            <h3 className="font-semibold text-white mb-4">{t.activeSessions}</h3>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">💻</span>
                                  <div>
                                    <p className="font-medium text-white">{t.chromeWindows}</p>
                                    <p className="text-sm text-white/60">{t.mumbaiIndia} • {t.now}</p>
                                  </div>
                                </div>
                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded font-medium">{t.current}</span>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl">📱</span>
                                  <div>
                                    <p className="font-medium text-white">{t.kamaiApp}</p>
                                    <p className="text-sm text-white/60">{t.delhiIndia} • 2 {t.hoursAgo}</p>
                                  </div>
                                </div>
                                <button className="text-xs text-red-400 hover:text-red-300 font-medium">{t.endSession}</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Privacy Settings */}
                    {activeTab === 'privacy' && (
                      <div className="bg-[#0B0F19] border border-white/10 rounded-2xl border border-white/10 shadow-sm p-8">
                        <h2 className="text-2xl font-bold text-white mb-6">{t.privacySettings}</h2>
                        
                        <div className="space-y-6 max-w-2xl">
                          <div className="flex items-center justify-between py-4">
                            <div>
                              <p className="font-semibold text-white">{t.dataSharing}</p>
                              <p className="text-sm text-white/60">{t.dataSharingDesc}</p>
                            </div>
                            <button
                              onClick={() => handleToggle('dataSharing')}
                              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                                preferences.dataSharing ? 'bg-[#1BD4CA]' : 'bg-white/10'
                              }`}
                            >
                              <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-sm ${
                                  preferences.dataSharing ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>

                          <div className="pt-6 border-t border-white/10">
                            <h3 className="font-semibold text-white mb-4">{t.dataManagement}</h3>
                            <div className="space-y-3">
                              <button className="w-full px-4 py-3 bg-white/5 text-white/90 rounded-xl hover:bg-white/10 transition text-left font-medium flex items-center justify-between">
                                <span>{t.downloadMyData}</span>
                                <span className="text-white/50">→</span>
                              </button>
                              <button className="w-full px-4 py-3 bg-white/5 text-white/90 rounded-xl hover:bg-white/10 transition text-left font-medium flex items-center justify-between">
                                <span>{t.requestDataDeletion}</span>
                                <span className="text-white/50">→</span>
                              </button>
                            </div>
                          </div>

                          <div className="pt-6 border-t border-white/10">
                            <h3 className="font-semibold text-white mb-4">{t.legalDocuments}</h3>
                            <div className="space-y-3">
                              <a href="#" className="block w-full px-4 py-3 bg-white/5 text-white/90 rounded-xl hover:bg-white/10 transition text-left font-medium flex items-center justify-between">
                                <span>{t.privacyPolicy}</span>
                                <span className="text-white/50">↗</span>
                              </a>
                              <a href="#" className="block w-full px-4 py-3 bg-white/5 text-white/90 rounded-xl hover:bg-white/10 transition text-left font-medium flex items-center justify-between">
                                <span>{t.termsOfService}</span>
                                <span className="text-white/50">↗</span>
                              </a>
                              <a href="#" className="block w-full px-4 py-3 bg-white/5 text-white/90 rounded-xl hover:bg-white/10 transition text-left font-medium flex items-center justify-between">
                                <span>{t.cookiePolicy}</span>
                                <span className="text-white/50">↗</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Billing Settings */}
                    {activeTab === 'billing' && (
                      <div className="bg-[#0B0F19] border border-white/10 rounded-2xl border border-white/10 shadow-sm p-8">
                        <h2 className="text-2xl font-bold text-white mb-6">{t.billingSubscription}</h2>
                        
                        <div className="space-y-6 max-w-2xl">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <p className="text-blue-100 text-sm mb-1">{t.currentPlan}</p>
                                <p className="text-2xl font-bold">Kamai Pro</p>
                              </div>
                              <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium">{t.active}</span>
                            </div>
                            <div className="text-sm text-blue-100">
                              {t.nextBillingDate}: December 24, 2025
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold text-white mb-4">{t.paymentMethod}</h3>
                            <div className="border border-white/10 rounded-xl p-4 bg-white/5 border border-white/10">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-blue-700 rounded flex items-center justify-center text-white text-xs font-bold">
                                    VISA
                                  </div>
                                  <div>
                                    <p className="font-medium text-white">•••• •••• •••• 4242</p>
                                    <p className="text-sm text-white/60">{t.expires} 12/2026</p>
                                  </div>
                                </div>
                                <button className="text-[#1BD4CA] hover:text-[#1BD4CA]/80 text-sm font-medium">{t.update}</button>
                              </div>
                            </div>
                            <button className="mt-3 text-[#1BD4CA] hover:text-[#1BD4CA]/80 text-sm font-medium">
                              {t.addPaymentMethod}
                            </button>
                          </div>

                          <div>
                            <h3 className="font-semibold text-white mb-4">{t.billingHistory}</h3>
                            <div className="space-y-2">
                              {[
                                { date: 'Nov 24, 2025', amount: '₹499', status: t.paid },
                                { date: 'Oct 24, 2025', amount: '₹499', status: t.paid },
                                { date: 'Sep 24, 2025', amount: '₹499', status: t.paid }
                              ].map((invoice, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                  <div>
                                    <p className="font-medium text-white">{invoice.date}</p>
                                    <p className="text-sm text-white/60">{t.monthlySubscription}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold text-white">{invoice.amount}</p>
                                    <p className="text-xs text-green-400 font-medium">{invoice.status}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <button className="mt-3 text-[#1BD4CA] hover:text-[#1BD4CA]/80 text-sm font-medium">
                              {t.viewAllInvoices}
                            </button>
                          </div>

                          <div className="pt-6 border-t border-white/10">
                            <button className="text-red-400 hover:text-red-300 font-medium">
                              {t.cancelSubscription}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Danger Zone */}
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 mt-8">
                    <h2 className="text-xl font-bold text-red-400 mb-4">{t.dangerZone}</h2>
                    <p className="text-red-300 mb-6">{t.dangerZoneDesc}</p>
                    <button className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition">
                      {t.deleteAccount}
                    </button>
                  </div>

                </div>
              )}
              
            </div>
          </div>
          
          <Footer />
        </div>
      </div>

      <style jsx global>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}