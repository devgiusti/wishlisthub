import React, { useState, useMemo, useCallback, useEffect } from 'react';

// --- Ambiente e Tratamento de Erros ---
const isProd = typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production';

// Centralizador de logs (silencia erros em produção)
const logError = (...args) => {
  if (!isProd) {
    // eslint-disable-next-line no-console
    console.error(...args);
  }
};

// --- Dicionário de Traduções ---
const translations = {
  pt: {
    appTitle: "WishlistHub", menu: "Menu", allItems: "Todos os Itens", myFolders: "Minhas Pastas",
    unknownFolder: "Pasta Desconhecida", share: "Compartilhar", add: "Adicionar",
    emptyTitle: "Nenhum item por aqui", emptyDesc: "Comece adicionando produtos que você deseja comprar.",
    addFirst: "Adicionar meu primeiro item", general: "Geral", visit: "Acessar",
    editWish: "Editar Desejo", addWish: "Adicionar Desejo", urlLabel: "Link do Produto (URL) *",
    nameLabel: "Nome do Produto *", imgLabel: "URL da Imagem (Opcional)", folderLabel: "Pasta",
    descLabel: "Descrição (Opcional)", saveList: "Salvar na Lista", saveChanges: "Salvar Alterações",
    editFolder: "Editar Pasta", newFolder: "Nova Pasta", folderNameLabel: "Nome da Pasta *",
    cancel: "Cancelar", create: "Criar", save: "Salvar", 
    shareTitle: "Link Ilustrativo",
    shareDesc: 'O WishlistHub funciona offline. Este link não sincroniza dados.', accessLink: "Link de Acesso",
    genToken: "Gerar Link", copyLink: "Copiar Link", copied: "Link copiado com sucesso!",
    urlPlaceholder: "https://amazon.com/...", namePlaceholder: "Ex: PlayStation 5", imgPlaceholder: "Link para a foto",
    descPlaceholder: "Por que eu quero isso?", folderPlaceholder: "Ex: Presentes de Natal", edit: "Editar", delete: "Excluir",
    itemsCount: "Itens", foldersCount: "Pastas", selectedMsg: "selecionado(s)", selectAll: "Selecionar Todos", 
    deselectAll: "Desmarcar Todos", deleteSelected: "Excluir Selecionados", confirmBulkDelete: "Excluir Selecionados?",
    confirmDeleteMsg: "Esta ação não pode ser desfeita. Todos os itens e pastas marcados serão apagados permanentemente.", yesDelete: "Sim, Excluir",
    confirmSingleDelete: "Excluir este item?", confirmSingleDeleteMsg: "Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.",
    priceLabel: "Valor/Moeda (Opcional)", pricePlaceholder: "Ex: R$ 150,00 ou $30",
    searchPlaceholder: "Pesquisar itens ou pastas...", sortDefault: "Padrão (Criação)", sortNameAsc: "Nome (A-Z)", sortNameDesc: "Nome (Z-A)", sortPriceAsc: "Preço (Menor)", sortPriceDesc: "Preço (Maior)",
    purchased: "Comprado", showPurchased: "Mostrar Comprados", hidePurchased: "Ocultar Comprados",
    quotaError: "Armazenamento local cheio! Exclua alguns itens para liberar espaço.",
    copyError: "Acesso à área de transferência negado.",
    manualCopy: "Copie o link abaixo manualmente:",
    shareWarning: "Aviso: O compartilhamento é apenas ilustrativo. Os dados são salvos localmente neste navegador e não são sincronizados entre dispositivos.",
    iframeWarning: "Por motivos de segurança (prevenção contra Clickjacking), este aplicativo não pode ser exibido dentro de um frame ou iframe.",
    export: "Exportar",
    import: "Importar",
    importConfirmMsg: "Importar irá substituir todos os dados atuais. Continuar?",
    importSuccessMsg: "Backup restaurado com sucesso!",
    invalidFileMsg: "Arquivo inválido",
    noItemsInTrash: "Nenhum item na lixeira",
    langNames: { pt: 'Português', en: 'Inglês', es: 'Espanhol', fr: 'Francês', it: 'Italiano', de: 'Alemão', zh: 'Chinês', ja: 'Japonês', ru: 'Russo' }
  },
  en: {
    appTitle: "WishlistHub", menu: "Menu", allItems: "All Items", myFolders: "My Folders",
    unknownFolder: "Unknown Folder", share: "Share", add: "Add",
    emptyTitle: "No items here", emptyDesc: "Start adding products you want to buy.",
    addFirst: "Add my first item", general: "General", visit: "Visit",
    editWish: "Edit Wish", addWish: "Add Wish", urlLabel: "Product Link (URL) *",
    nameLabel: "Product Name *", imgLabel: "Image URL (Optional)", folderLabel: "Folder",
    descLabel: "Description (Optional)", saveList: "Save to List", saveChanges: "Save Changes",
    editFolder: "Edit Folder", newFolder: "New Folder", folderNameLabel: "Folder Name *",
    cancel: "Cancel", create: "Create", save: "Save", 
    shareTitle: "Illustrative Link",
    shareDesc: 'WishlistHub works offline. This link does not sync data.', accessLink: "Access Link",
    genToken: "Generate Link", copyLink: "Copy Link", copied: "Link copied successfully!",
    urlPlaceholder: "https://amazon.com/...", namePlaceholder: "Ex: PlayStation 5", imgPlaceholder: "Link to product photo",
    descPlaceholder: "Why do I want this?", folderPlaceholder: "Ex: Christmas Gifts", edit: "Edit", delete: "Delete",
    itemsCount: "Items", foldersCount: "Folders", selectedMsg: "selected", selectAll: "Select All", 
    deselectAll: "Deselect All", deleteSelected: "Delete Selected", confirmBulkDelete: "Delete Selected?",
    confirmDeleteMsg: "This action cannot be undone. All selected items and folders will be permanently deleted.", yesDelete: "Yes, Delete",
    confirmSingleDelete: "Delete this item?", confirmSingleDeleteMsg: "Are you sure you want to delete this item? This action cannot be undone.",
    priceLabel: "Price/Currency (Optional)", pricePlaceholder: "Ex: $150.00 or 30 EUR",
    searchPlaceholder: "Search items or folders...", sortDefault: "Default (Created)", sortNameAsc: "Name (A-Z)", sortNameDesc: "Name (Z-A)", sortPriceAsc: "Price (Low-High)", sortPriceDesc: "Price (High-Low)",
    purchased: "Purchased", showPurchased: "Show Purchased", hidePurchased: "Hide Purchased",
    pending: "Pending",
    quotaError: "Local storage full! Please delete some items to free up space.",
    copyError: "Clipboard access denied.",
    manualCopy: "Please copy the link below manually:",
    shareWarning: "Notice: Sharing is for illustration only. Data is stored locally in this browser and does not sync across devices.",
    iframeWarning: "For security reasons (Clickjacking prevention), this application cannot be displayed inside a frame or iframe.",
    export: "Export",
    import: "Import",
    importConfirmMsg: "Import will replace all current data. Continue?",
    importSuccessMsg: "Backup restored successfully!",
    invalidFileMsg: "Invalid file",
    noItemsInTrash: "No items in trash",
    langNames: { pt: 'Portuguese', en: 'English', es: 'Spanish', fr: 'French', it: 'Italian', de: 'German', zh: 'Chinese', ja: 'Japanese', ru: 'Russian' }
  },
  es: {
    appTitle: "WishlistHub", menu: "Menú", allItems: "Todos los Artículos", myFolders: "Mis Carpetas",
    unknownFolder: "Carpeta Desconocida", share: "Compartir", add: "Añadir",
    emptyTitle: "No hay artículos aquí", emptyDesc: "Empieza a añadir productos que deseas comprar.",
    addFirst: "Añadir mi primer artículo", general: "General", visit: "Visitar",
    editWish: "Editar Deseo", addWish: "Añadir Deseo", urlLabel: "Enlace del Producto (URL) *",
    nameLabel: "Nombre del Producto *", imgLabel: "URL de la Imagen (Opcional)", folderLabel: "Carpeta",
    descLabel: "Descripción (Opcional)", saveList: "Guardar", saveChanges: "Guardar Cambios",
    editFolder: "Editar Carpeta", newFolder: "Nueva Carpeta", folderNameLabel: "Nombre de la Carpeta *",
    cancel: "Cancelar", create: "Crear", save: "Guardar", 
    shareTitle: "Enlace Ilustrativo",
    shareDesc: 'WishlistHub funciona sin conexión. Este enlace no sincroniza datos.', accessLink: "Enlace de Acceso",
    genToken: "Generar Enlace", copyLink: "Copiar Enlace", copied: "¡Enlace copiado con éxito!",
    urlPlaceholder: "https://amazon.com/...", namePlaceholder: "Ej: PlayStation 5", imgPlaceholder: "Enlace a la foto",
    descPlaceholder: "¿Por qué quiero esto?", folderPlaceholder: "Ej: Regalos de Navidad", edit: "Editar", delete: "Eliminar",
    itemsCount: "Artículos", foldersCount: "Carpetas", selectedMsg: "seleccionado(s)", selectAll: "Seleccionar Todo", 
    deselectAll: "Deseleccionar Todo", deleteSelected: "Eliminar Selección", confirmBulkDelete: "¿Eliminar Selección?",
    confirmDeleteMsg: "Esta acción no se puede deshacer. Todos los artículos y carpetas seleccionados se eliminarán permanentemente.", yesDelete: "Sí, Eliminar",
    confirmSingleDelete: "¿Eliminar artículo?", confirmSingleDeleteMsg: "¿Seguro que quieres eliminar este artículo? Esta acción no se puede deshacer.",
    priceLabel: "Precio/Moneda (Opcional)", pricePlaceholder: "Ej: 150€ o $30",
    searchPlaceholder: "Buscar artículos o carpetas...", sortDefault: "Por defecto", sortNameAsc: "Nombre (A-Z)", sortNameDesc: "Nombre (Z-A)", sortPriceAsc: "Precio (Menor)", sortPriceDesc: "Precio (Mayor)",
    purchased: "Comprado", showPurchased: "Mostrar Comprados", hidePurchased: "Ocultar Comprados",
    quotaError: "¡Almacenamiento local lleno! Elimina algunos artículos para liberar espacio.",
    copyError: "Acceso al portapapeles denegado.",
    manualCopy: "Copia el enlace de abajo manualmente:",
    shareWarning: "Aviso: La función de compartir es solo ilustrativa. Los datos se guardan localmente y no se sincronizan entre dispositivos.",
    iframeWarning: "Por motivos de segurança (prevención de Clickjacking), esta aplicación no puede mostrarse dentro de un frame o iframe.",
    totalItems: "Total de artículos",
    purchased: "Comprados",
    pending: "Pendientes",
    totalSpent: "Gasto total (estimado)",
    currency: "€",
    trashTitle: "Papelera",
    restore: "Restaurar",
    emptyTrash: "Vaciar Papelera",
    confirmEmptyTrash: "¿Vaciar papelera permanentemente?",
    itemMovedToTrash: "Artículo movido a la papelera",
    trashEmptied: "Papelera vaciada",
    itemRestored: "Artículo restaurado",
    export: "Exportar",
    import: "Importar",
    importConfirmMsg: "La importación reemplazará todos los datos actuales. ¿Continuar?",
    importSuccessMsg: "¡Copia de seguridad restaurada con éxito!",
    invalidFileMsg: "Archivo inválido",
    noItemsInTrash: "No hay artículos en la papelera",
    langNames: { pt: 'Portugués', en: 'Inglés', es: 'Español', fr: 'Francés', it: 'Italiano', de: 'Alemán', zh: 'Chino', ja: 'Japonés', ru: 'Ruso' }
  },
  fr: {
    appTitle: "WishlistHub", menu: "Menu", allItems: "Tous les Articles", myFolders: "Mes Dossiers",
    unknownFolder: "Dossier Inconnu", share: "Partager", add: "Ajouter",
    emptyTitle: "Aucun article ici", emptyDesc: "Commencez à ajouter les produits que vous souhaitez acheter.",
    addFirst: "Ajouter mon premier article", general: "Général", visit: "Visiter",
    editWish: "Modifier Souhait", addWish: "Ajouter Souhait", urlLabel: "Lien du produit (URL) *",
    nameLabel: "Nom du produit *", imgLabel: "URL de l'image (Optionnel)", folderLabel: "Dossier",
    descLabel: "Description (Optionnel)", saveList: "Enregistrer", saveChanges: "Enregistrer modifs",
    editFolder: "Modifier Dossier", newFolder: "Nouveau Dossier", folderNameLabel: "Nom du Dossier *",
    cancel: "Annuler", create: "Créer", save: "Enregistrer", 
    shareTitle: "Lien Illustratif",
    shareDesc: 'WishlistHub fonctionne hors ligne. Ce lien ne synchronise pas les données.', accessLink: "Lien d'accès",
    genToken: "Générer un Lien", copyLink: "Copier le lien", copied: "Lien copié avec succès !",
    urlPlaceholder: "https://amazon.com/...", namePlaceholder: "Ex: PlayStation 5", imgPlaceholder: "Lien vers la photo",
    descPlaceholder: "Pourquoi je veux ça ?", folderPlaceholder: "Ex: Cadeaux de Noël", edit: "Modifier", delete: "Supprimer",
    itemsCount: "Articles", foldersCount: "Dossiers", selectedMsg: "sélectionné(s)", selectAll: "Tout Sélectionner", 
    deselectAll: "Tout Désélectionner", deleteSelected: "Supprimer Sélection", confirmBulkDelete: "Supprimer la sélection ?",
    confirmDeleteMsg: "Cette action est irréversible. Tous les articles et dossiers sélectionnés seront supprimés.", yesDelete: "Oui, Supprimer",
    confirmSingleDelete: "Supprimer cet article ?", confirmSingleDeleteMsg: "Êtes-vous sûr de vouloir supprimer cet article ? Action irréversible.",
    priceLabel: "Prix/Devise (Optionnel)", pricePlaceholder: "Ex: 150 € ou $30",
    searchPlaceholder: "Rechercher...", sortDefault: "Défaut", sortNameAsc: "Nom (A-Z)", sortNameDesc: "Nom (Z-A)", sortPriceAsc: "Prix (Croissant)", sortPriceDesc: "Prix (Décroissant)",
    purchased: "Acheté", showPurchased: "Afficher Achetés", hidePurchased: "Masquer Achetés",
    quotaError: "Stockage local plein ! Veuillez supprimer des éléments.",
    copyError: "Accès au presse-papiers refusé.",
    manualCopy: "Veuillez copier le lien ci-dessous manuellement :",
    shareWarning: "Avis : Le partage n'est qu'illustratif. Les données sont stockées localement et ne se synchronisent pas entre les appareils.",
    iframeWarning: "Pour des raisons de sécurité (prévention du Clickjacking), cette application ne peut pas être affichée dans un frame ou iframe.",
    totalItems: "Total d'articles",
    purchased: "Achetés",
    pending: "En attente",
    totalSpent: "Dépense totale (estimée)",
    currency: "€",
    trashTitle: "Corbeille",
    restore: "Restaurer",
    emptyTrash: "Vider la corbeille",
    confirmEmptyTrash: "Vider la corbeille définitivement ?",
    itemMovedToTrash: "Article déplacé vers la corbeille",
    trashEmptied: "Corbeille vidée",
    itemRestored: "Article restauré",
    export: "Exporter",
    import: "Importer",
    importConfirmMsg: "L'importation remplacera toutes les données actuelles. Continuer ?",
    importSuccessMsg: "Sauvegarde restaurée avec succès !",
    invalidFileMsg: "Fichier invalide",
    noItemsInTrash: "Aucun article dans la corbeille",
    langNames: { pt: 'Portugais', en: 'Anglais', es: 'Espagnol', fr: 'Français', it: 'Italien', de: 'Allemand', zh: 'Chinois', ja: 'Japonais', ru: 'Russe' }
  },
  it: {
    appTitle: "WishlistHub", menu: "Menu", allItems: "Tutti gli Oggetti", myFolders: "Le Mie Cartelle",
    unknownFolder: "Cartella Sconosciuta", share: "Condividi", add: "Aggiungi",
    emptyTitle: "Nessun oggetto qui", emptyDesc: "Inizia ad aggiungere prodotti che desideri acquistare.",
    addFirst: "Aggiungi il mio primo oggetto", general: "Generale", visit: "Visita",
    editWish: "Modifica Desiderio", addWish: "Aggiungi Desiderio", urlLabel: "Link del Prodotto (URL) *",
    nameLabel: "Nome del Prodotto *", imgLabel: "URL Immagine (Opzionale)", folderLabel: "Cartella",
    descLabel: "Descrizione (Opzionale)", saveList: "Salva", saveChanges: "Salva Modifiche",
    editFolder: "Modifica Cartella", newFolder: "Nuova Cartella", folderNameLabel: "Nome Cartella *",
    cancel: "Annulla", create: "Crea", save: "Salva", 
    shareTitle: "Link Illustrativo",
    shareDesc: 'WishlistHub funziona offline. Questo link non sincronizza i dati.', accessLink: "Link di Accesso",
    genToken: "Genera Link", copyLink: "Copia Link", copied: "Link copiato con successo!",
    urlPlaceholder: "https://amazon.com/...", namePlaceholder: "Es: PlayStation 5", imgPlaceholder: "Link alla foto",
    descPlaceholder: "Perché lo voglio?", folderPlaceholder: "Es: Regali di Natale", edit: "Modifica", delete: "Elimina",
    itemsCount: "Oggetti", foldersCount: "Cartelle", selectedMsg: "selezionato/i", selectAll: "Seleziona Tutto", 
    deselectAll: "Deseleziona Tutto", deleteSelected: "Elimina Selezione", confirmBulkDelete: "Elimina Selezione?",
    confirmDeleteMsg: "Questa azione non può essere annullata. Tutti gli oggetti e le cartelle selezionati verranno eliminati.", yesDelete: "Sì, Elimina",
    confirmSingleDelete: "Eliminare questo oggetto?", confirmSingleDeleteMsg: "Sei sicuro di voler eliminare questo oggetto? Questa azione non può essere annullata.",
    priceLabel: "Prezzo/Valuta (Opzionale)", pricePlaceholder: "Es: 150 € o $30",
    searchPlaceholder: "Cerca...", sortDefault: "Predefinito", sortNameAsc: "Nome (A-Z)", sortNameDesc: "Nome (Z-A)", sortPriceAsc: "Prezzo (Min)", sortPriceDesc: "Prezzo (Max)",
    purchased: "Acquistato", showPurchased: "Mostra Acquistati", hidePurchased: "Nascondi Acquistati",
    quotaError: "Memoria locale piena! Elimina alcuni oggetti per liberare spazio.",
    copyError: "Accesso agli appunti negato.",
    manualCopy: "Copia manualmente il link sottostante:",
    shareWarning: "Avviso: La condivisione è solo a scopo illustrativo. I dati sono salvati localmente su questo dispositivo.",
    iframeWarning: "Per motivi di sicurezza (prevenzione Clickjacking), questa applicazione non può essere visualizzata in un frame o iframe.",
    totalItems: "Totale articoli",
    purchased: "Acquistati",
    pending: "In attesa",
    totalSpent: "Spesa totale (stimata)",
    currency: "€",
    trashTitle: "Cestino",
    restore: "Ripristina",
    emptyTrash: "Svuota cestino",
    confirmEmptyTrash: "Svuotare il cestino definitivamente?",
    itemMovedToTrash: "Articolo spostato nel cestino",
    trashEmptied: "Cestino svuotato",
    itemRestored: "Articolo ripristinato",
    export: "Esporta",
    import: "Importa",
    importConfirmMsg: "L'importazione sostituirà tutti i dati attuali. Continuare?",
    importSuccessMsg: "Backup ripristinato con successo!",
    invalidFileMsg: "File non valido",
    noItemsInTrash: "Nessun oggetto nel cestino",
    langNames: { pt: 'Portoghese', en: 'Inglese', es: 'Spagnolo', fr: 'Francese', it: 'Italiano', de: 'Tedesco', zh: 'Cinese', ja: 'Giapponese', ru: 'Russo' }
  },
  de: {
    appTitle: "WishlistHub", menu: "Menü", allItems: "Alle Artikel", myFolders: "Meine Ordner",
    unknownFolder: "Unbekannter Ordner", share: "Teilen", add: "Hinzufügen",
    emptyTitle: "Keine Artikel hier", emptyDesc: "Fügen Sie Produkte hinzu, die Sie kaufen möchten.",
    addFirst: "Ersten Artikel hinzufügen", general: "Allgemein", visit: "Besuchen",
    editWish: "Wunsch bearbeiten", addWish: "Wunsch hinzufügen", urlLabel: "Produktlink (URL) *",
    nameLabel: "Produktname *", imgLabel: "Bild-URL (Optional)", folderLabel: "Ordner",
    descLabel: "Beschreibung (Optional)", saveList: "Speichern", saveChanges: "Änderungen speichern",
    editFolder: "Ordner bearbeiten", newFolder: "Neuer Ordner", folderNameLabel: "Ordnername *",
    cancel: "Abbrechen", create: "Erstellen", save: "Speichern", 
    shareTitle: "Illustrativer Link",
    shareDesc: 'WishlistHub funktioniert offline. Dieser Link synchronisiert keine Daten.', accessLink: "Zugriffslink",
    genToken: "Link generieren", copyLink: "Link kopieren", copied: "Link erfolgreich kopiert!",
    urlPlaceholder: "https://amazon.com/...", namePlaceholder: "Bsp: PlayStation 5", imgPlaceholder: "Link zum Foto",
    descPlaceholder: "Warum will ich das?", folderPlaceholder: "Bsp: Weihnachtsgeschenke", edit: "Bearbeiten", delete: "Löschen",
    itemsCount: "Artikel", foldersCount: "Ordner", selectedMsg: "ausgewählt", selectAll: "Alles auswählen", 
    deselectAll: "Auswahl aufheben", deleteSelected: "Auswahl löschen", confirmBulkDelete: "Auswahl löschen?",
    confirmDeleteMsg: "Diese Aktion kann nicht rückgängig gemacht werden.", yesDelete: "Ja, Löschen",
    confirmSingleDelete: "Diesen Artikel löschen?", confirmSingleDeleteMsg: "Sind Sie sicher? Diese Aktion kann nicht rückgängig gemacht werden.",
    priceLabel: "Preis/Währung (Optional)", pricePlaceholder: "Bsp: 150 € oder $30",
    searchPlaceholder: "Suchen...", sortDefault: "Standard", sortNameAsc: "Name (A-Z)", sortNameDesc: "Name (Z-A)", sortPriceAsc: "Preis (Aufsteigend)", sortPriceDesc: "Preis (Absteigend)",
    purchased: "Gekauft", showPurchased: "Gekaufte anzeigen", hidePurchased: "Gekaufte ausblenden",
    quotaError: "Lokaler Speicher voll! Bitte löschen Sie einige Elemente.",
    copyError: "Zugriff auf die Zwischenablage verweigert.",
    manualCopy: "Bitte kopieren Sie den Link unten manuell:",
    shareWarning: "Hinweis: Die Teilen-Funktion ist nur illustrativ. Daten werden lokal auf diesem Gerät gespeichert.",
    iframeWarning: "Aus Sicherheitsgründen (Clickjacking-Schutz) kann diese Anwendung nicht in einem Frame oder Iframe angezeigt werden.",
    totalItems: "Gesamtanzahl Artikel",
    purchased: "Gekauft",
    pending: "Ausstehend",
    totalSpent: "Gesamtausgabe (geschätzt)",
    currency: "€",
    trashTitle: "Papierkorb",
    restore: "Wiederherstellen",
    emptyTrash: "Papierkorb leeren",
    confirmEmptyTrash: "Papierkorb endgültig leeren?",
    itemMovedToTrash: "Artikel in den Papierkorb verschoben",
    trashEmptied: "Papierkorb geleert",
    itemRestored: "Artikel wiederhergestellt",
    export: "Exportieren",
    import: "Importieren",
    importConfirmMsg: "Der Import ersetzt alle aktuellen Daten. Fortfahren?",
    importSuccessMsg: "Backup erfolgreich wiederhergestellt!",
    invalidFileMsg: "Ungültige Datei",
    noItemsInTrash: "Keine Artikel im Papierkorb",
    langNames: { pt: 'Portugiesisch', en: 'Englisch', es: 'Spanisch', fr: 'Französisch', it: 'Italienisch', de: 'Deutsch', zh: 'Chinesisch', ja: 'Japanisch', ru: 'Russisch' }
  },
  zh: {
    appTitle: "WishlistHub", menu: "菜单", allItems: "所有物品", myFolders: "我的文件夹",
    unknownFolder: "未知文件夹", share: "分享", add: "添加",
    emptyTitle: "这里没有物品", emptyDesc: "开始添加您想购买的产品。",
    addFirst: "添加我的第一个物品", general: "常规", visit: "访问",
    editWish: "编辑心愿", addWish: "添加心愿", urlLabel: "产品链接 (URL) *",
    nameLabel: "产品名称 *", imgLabel: "图片链接 (可选)", folderLabel: "文件夹",
    descLabel: "描述 (可选)", saveList: "保存到列表", saveChanges: "保存更改",
    editFolder: "编辑文件夹", newFolder: "新文件夹", folderNameLabel: "文件夹名称 *",
    cancel: "取消", create: "创建", save: "保存", 
    shareTitle: "说明性链接",
    shareDesc: 'WishlistHub 离线工作。此链接不涉及数据同步。', accessLink: "访问链接",
    genToken: "生成链接", copyLink: "复制链接", copied: "链接复制成功！",
    urlPlaceholder: "https://amazon.com/...", namePlaceholder: "例: PlayStation 5", imgPlaceholder: "产品照片链接",
    descPlaceholder: "为什么我想要这个？", folderPlaceholder: "例: 圣诞礼物", edit: "编辑", delete: "删除",
    itemsCount: "个物品", foldersCount: "文件夹", selectedMsg: "已选择", selectAll: "全选", 
    deselectAll: "取消全选", deleteSelected: "删除所选", confirmBulkDelete: "删除所选？",
    confirmDeleteMsg: "此操作无法撤销。所有选定的物品和文件夹将被永久删除。", yesDelete: "是，删除",
    confirmSingleDelete: "删除此物品？", confirmSingleDeleteMsg: "您确定要删除此物品吗？此操作无法撤销。",
    priceLabel: "价格/货币 (可选)", pricePlaceholder: "例: ¥150 或 $30",
    searchPlaceholder: "搜索...", sortDefault: "默认", sortNameAsc: "名称 (A-Z)", sortNameDesc: "名称 (Z-A)", sortPriceAsc: "价格 (低到高)", sortPriceDesc: "价格 (高到低)",
    purchased: "已购买", showPurchased: "显示已购", hidePurchased: "隐藏已购",
    quotaError: "本地存储已满！请删除一些项目以释放空间。",
    copyError: "剪贴板访问被拒绝。",
    manualCopy: "请手动复制下面的链接：",
    shareWarning: "注意：分享功能仅作演示。数据仅保存在此浏览器的本地存储中，不会在设备间同步。",
    iframeWarning: "出于安全原因（防止点击劫持），此应用程序无法在框架或 iframe 中显示。",
    totalItems: "物品总数",
    purchased: "已购买",
    pending: "待处理",
    totalSpent: "总花费（估计）",
    currency: "¥",
    trashTitle: "回收站",
    restore: "恢复",
    emptyTrash: "清空回收站",
    confirmEmptyTrash: "永久清空回收站？",
    itemMovedToTrash: "物品已移至回收站",
    trashEmptied: "回收站已清空",
    itemRestored: "物品已恢复",
    export: "导出",
    import: "导入",
    importConfirmMsg: "导入将替换所有当前数据。继续吗？",
    importSuccessMsg: "备份恢复成功！",
    invalidFileMsg: "无效文件",
    noItemsInTrash: "回收站中没有物品",
    langNames: { pt: '葡萄牙语', en: '英语', es: '西班牙语', fr: '法语', it: '意大利语', de: '德语', zh: '中文', ja: '日语', ru: '俄语' }
  },
  ja: {
    appTitle: "WishlistHub", menu: "メニュー", allItems: "すべてのアイテム", myFolders: "マイフォルダ",
    unknownFolder: "不明なフォルダ", share: "共有", add: "追加",
    emptyTitle: "アイテムがありません", emptyDesc: "購入したい商品の追加を始めましょう。",
    addFirst: "最初のアイテムを追加", general: "一般", visit: "アクセス",
    editWish: "願いを編集", addWish: "願いを追加", urlLabel: "商品リンク (URL) *",
    nameLabel: "商品名 *", imgLabel: "画像URL (任意)", folderLabel: "フォルダ",
    descLabel: "説明 (任意)", saveList: "リストに保存", saveChanges: "変更を保存",
    editFolder: "フォルダを編集", newFolder: "新規フォルダ", folderNameLabel: "フォルダ名 *",
    cancel: "キャンセル", create: "作成", save: "保存", 
    shareTitle: "説明用リンク",
    shareDesc: 'WishlistHubはオフラインで動作します。このリンクはデータを同期しません。', accessLink: "アクセスリンク",
    genToken: "リンクを生成", copyLink: "リンクをコピー", copied: "リンクをコピーしました！",
    urlPlaceholder: "https://amazon.com/...", namePlaceholder: "例: PlayStation 5", imgPlaceholder: "写真へのリンク",
    descPlaceholder: "なぜこれが欲しいのか？", folderPlaceholder: "例: クリスマスプレゼント", edit: "編集", delete: "削除",
    itemsCount: "アイテム", foldersCount: "フォルダ", selectedMsg: "選択中", selectAll: "すべて選択", 
    deselectAll: "選択解除", deleteSelected: "選択項目を削除", confirmBulkDelete: "選択項目を削除しますか？",
    confirmDeleteMsg: "この操作は元に戻せません。完全に削除されます。", yesDelete: "はい、削除します",
    confirmSingleDelete: "このアイテムを削除しますか？", confirmSingleDeleteMsg: "本当に削除しますか？この操作は元に戻せません。",
    priceLabel: "価格/通貨 (任意)", pricePlaceholder: "例: ¥1,500 または $30",
    searchPlaceholder: "検索...", sortDefault: "デフォルト", sortNameAsc: "名前 (A-Z)", sortNameDesc: "名前 (Z-A)", sortPriceAsc: "価格 (安い順)", sortPriceDesc: "価格 (高い順)",
    purchased: "購入済み", showPurchased: "購入済みを表示", hidePurchased: "購入済みを非表示",
    quotaError: "ローカルストレージがいっぱいです！容量を空けるためにアイテムを削除してください。",
    copyError: "クリップボードへのアクセスが拒否されました。",
    manualCopy: "下のリンクを手動でコピーしてください:",
    shareWarning: "注意: 共有機能はデモンストレーション用です。データはローカルにのみ保存され、同期されません。",
    iframeWarning: "セキュリティ上の理由（クリックジャッキング防止）により、このアプリケーションはフレームまたは iframe 内に表示できません。",
    totalItems: "アイテム総数",
    purchased: "購入済み",
    pending: "保留中",
    totalSpent: "総支出（概算）",
    currency: "¥",
    trashTitle: "ゴミ箱",
    restore: "復元",
    emptyTrash: "ゴミ箱を空にする",
    confirmEmptyTrash: "ゴミ箱を完全に空にしますか？",
    itemMovedToTrash: "アイテムをゴミ箱に移動しました",
    trashEmptied: "ゴミ箱を空にしました",
    itemRestored: "アイテムを復元しました",
    export: "エクスポート",
    import: "インポート",
    importConfirmMsg: "インポートすると現在のデータがすべて置き換えられます。続行しますか？",
    importSuccessMsg: "バックアップの復元に成功しました！",
    invalidFileMsg: "無効なファイル",
    noItemsInTrash: "ゴミ箱にアイテムはありません",
    langNames: { pt: 'ポルトガル語', en: '英語', es: 'スペイン어', fr: 'フランス語', it: 'イタリア語', de: 'ドイツ語', zh: '中国語', ja: '日本語', ru: 'ロシア語' }
  },
  ru: {
    appTitle: "WishlistHub", menu: "Меню", allItems: "Все элементы", myFolders: "Мои папки",
    unknownFolder: "Неизвестная папка", share: "Поделиться", add: "Добавить",
    emptyTitle: "Здесь пусто", emptyDesc: "Начните добавлять товары, которые хотите купить.",
    addFirst: "Добавить первый товар", general: "Общее", visit: "Перейти",
    editWish: "Изменить желание", addWish: "Добавить желание", urlLabel: "Ссылка на товар (URL) *",
    nameLabel: "Название товара *", imgLabel: "URL картинки (необязательно)", folderLabel: "Папка",
    descLabel: "Описание (необязательно)", saveList: "Сохранить", saveChanges: "Сохранить изменения",
    editFolder: "Изменить папку", newFolder: "Новая папка", folderNameLabel: "Имя папки *",
    cancel: "Отмена", create: "Создать", save: "Сохранить", 
    shareTitle: "Иллюстративная ссылка",
    shareDesc: 'WishlistHub работает в автономном режиме. Эта ссылка не синхронизирует данные.', accessLink: "Ссылка",
    genToken: "Сгенерировать ссылку", copyLink: "Копировать ссылку", copied: "Ссылка успешно скопирована!",
    urlPlaceholder: "https://amazon.com/...", namePlaceholder: "Напр: PlayStation 5", imgPlaceholder: "Ссылка на фото",
    descPlaceholder: "Почему я это хочу?", folderPlaceholder: "Напр: Подарки на Новый год", edit: "Изменить", delete: "Удалить",
    itemsCount: "элементов", foldersCount: "Папки", selectedMsg: "выбрано", selectAll: "Выбрать все", 
    deselectAll: "Снять выделение", deleteSelected: "Удалить выбранное", confirmBulkDelete: "Удалить выбранное?",
    confirmDeleteMsg: "Это действие нельзя отменить. Все выбранные элементы будут удалены.", yesDelete: "Да, удалить",
    confirmSingleDelete: "Удалить этот элемент?", confirmSingleDeleteMsg: "Вы уверены? Это действие нельзя отменить.",
    priceLabel: "Цена/Валюта (Необязательно)", pricePlaceholder: "Напр: 1500 руб или $30",
    searchPlaceholder: "Поиск...", sortDefault: "По умолчанию", sortNameAsc: "Имя (А-Я)", sortNameDesc: "Имя (Я-А)", sortPriceAsc: "Цена (по возрастанию)", sortPriceDesc: "Цена (по убыванию)",
    purchased: "Куплено", showPurchased: "Показать купленные", hidePurchased: "Скрыть купленные",
    quotaError: "Локальное хранилище заполнено! Пожалуйста, удалите некоторые элементы.",
    copyError: "Доступ к буферу обмена запрещен.",
    manualCopy: "Пожалуйста, скопируйте ссылку ниже вручную:",
    shareWarning: "Внимание: функция обмена является лишь иллюстрацией. Данные сохраняются только локально на этом устройстве.",
    iframeWarning: "В целях безопасности (предотвращение кликджекинга) это приложение не может отображаться во фрейме или iframe.",
    totalItems: "Всего предметов",
    purchased: "Куплено",
    pending: "Ожидают",
    totalSpent: "Всего потрачено (оценка)",
    currency: "₽",
    trashTitle: "Корзина",
    restore: "Восстановить",
    emptyTrash: "Очистить корзину",
    confirmEmptyTrash: "Очистить корзину навсегда?",
    itemMovedToTrash: "Предмет перемещён в корзину",
    trashEmptied: "Корзина очищена",
    itemRestored: "Предмет восстановлен",
    export: "Экспорт",
    import: "Импорт",
    importConfirmMsg: "Импорт заменит все текущие данные. Продолжить?",
    importSuccessMsg: "Резервная копия восстановлена!",
    invalidFileMsg: "Неверный файл",
    noItemsInTrash: "Нет элементов в корзине",
    langNames: { pt: 'Португальский', en: 'Английский', es: 'Испанский', fr: 'Французский', it: 'Итальянский', de: 'Немецкий', zh: 'Китайский', ja: 'Японский', ru: 'Русский' }
  }
};

// --- Ícones (SVGs inline) com React.memo (Otimização) ---
const IconPlus = React.memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>);
const IconFolder = React.memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>);
const IconTrash = React.memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>);
const IconShare = React.memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>);
const IconGrid = React.memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>);
const IconList = React.memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>);
const IconExternalLink = React.memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>);
const IconMenu = React.memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>);
const IconX = React.memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>);
const IconEdit = React.memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>);
const IconLock = React.memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>);
const IconMoon = React.memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>);
const IconSun = React.memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>);
const IconGlobe = React.memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>);
const IconSearch = React.memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>);
const IconCheck = React.memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>);
const IconWarning = React.memo(() => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>);
const IconStar = React.memo(() => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
));

// --- Segurança: Hardening e Sanitização de URLs ---
const SAFE_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjZTVlN2ViIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+';

const getSafeImageUrl = (url) => {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.href;
    }
  } catch (e) {
    // Ignora erro de parse silenciosamente
  }
  return SAFE_PLACEHOLDER;
};

const getSafeUrl = (url) => {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.href;
    }
  } catch (e) {}
  return '#'; 
};

// --- Gestão Robusta e Validação Profunda de LocalStorage ---
let quotaCallback = null;

const safeGetStorage = (key, fallback, validatorType = null) => {
  try {
    const item = window.localStorage.getItem('wishlist_' + key);
    if (!item) return fallback;
    
    const parsed = JSON.parse(item);

    if (validatorType === 'items') {
      if (!Array.isArray(parsed)) throw new Error('Items data is not an array');
      
      const validItems = parsed.filter(item => {
        if (!item || typeof item !== 'object') return false;
        if (typeof item.id !== 'string' || !item.id) return false;
        return true;
      }).map(item => ({
        ...item,
        id: item.id.substring(0, 50),
        title: (typeof item.title === 'string' ? item.title : '').substring(0, 100),
        description: (typeof item.description === 'string' ? item.description : '').substring(0, 1000),
        price: (typeof item.price === 'string' ? item.price : '').substring(0, 30),
        url: (typeof item.url === 'string' ? item.url : '').substring(0, 2000),
        imageUrl: (typeof item.imageUrl === 'string' ? item.imageUrl : '').substring(0, 2000),
        folderId: ((typeof item.folderId === 'string' && item.folderId) ? item.folderId : 'unassigned').substring(0, 50),
        isPurchased: !!item.isPurchased
      }));
      
      // Se não era um array vazio, mas todos os itens foram filtrados (corrompidos), use fallback
      if (parsed.length > 0 && validItems.length === 0) return fallback;
      return validItems;
    }

    if (validatorType === 'folders') {
      if (!Array.isArray(parsed)) throw new Error('Folders data is not an array');
      
      const validFolders = parsed.filter(f => 
        f && typeof f === 'object' && typeof f.id === 'string' && f.id && typeof f.name === 'string'
      ).map(f => ({
        ...f,
        id: f.id.substring(0, 50),
        name: f.name.substring(0, 50)
      }));
      
      if (parsed.length > 0 && validFolders.length === 0) return fallback;
      return validFolders;
    }

    return parsed;
  } catch (error) {
    logError(`Erro ao ler/validar ${key} do storage, usando fallback:`, error);
    return fallback;
  }
};

const safeSetStorage = (key, value) => {
  try {
    window.localStorage.setItem('wishlist_' + key, JSON.stringify(value));
  } catch (error) {
    logError(`Erro ao escrever ${key} no storage:`, error);
    if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      if (quotaCallback) quotaCallback();
    }
  }
};

// --- Função para normalizar acentos na busca ---
const removeAccents = (str) => {
  if (!str) return '';
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

// --- Confetes caseiro (sem Web Worker, sem CSP extra) ---
const simpleConfetti = (): void => {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    document.body.removeChild(canvas);
    return;
  }
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    life: number;
  };

  const particles: Particle[] = Array.from({ length: 100 }, () => ({
    x: Math.random() * canvas.width,
    y: canvas.height,
    vx: (Math.random() - 0.5) * 3,
    vy: -Math.random() * 8 - 2,
    size: Math.random() * 6 + 2,
    color: `hsl(${Math.random() * 360}, 70%, 60%)`,
    life: 1,
  }));

  let animationId: number | null = null;

  const animate = (): void => {
    let allDead = true;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2;
      p.life -= 0.01;
      if (p.life > 0 && p.y < canvas.height) allDead = false;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.life <= 0) continue;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }
    if (allDead) {
      if (animationId) cancelAnimationFrame(animationId);
      document.body.removeChild(canvas);
    } else {
      animationId = requestAnimationFrame(animate);
    }
  };
  animate();
};

export default function App() {
  // --- Proteção contra Clickjacking e Injeção de Meta Tags ---
  const [isIframeBlocked, setIsIframeBlocked] = useState(false);

  useEffect(() => {
    // 1. Resiliência contra Iframe (Não invasivo)
    try {
      if (window.top !== window.self) {
        setIsIframeBlocked(true);
      }
    } catch (e) {
      setIsIframeBlocked(true);
    }

    // 2. Injeção de Meta Tags de Privacidade (Referrer)
    if (!document.querySelector('meta[name="referrer"]')) {
      const metaRef = document.createElement('meta');
      metaRef.name = 'referrer';
      metaRef.content = 'no-referrer';
      document.head.appendChild(metaRef);
    }

    // 3. Injeção da Content Security Policy (Compatível com GitHub Pages)
    if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      const metaCsp = document.createElement('meta');
      metaCsp.httpEquiv = 'Content-Security-Policy';
      metaCsp.content = "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self';";
      document.head.appendChild(metaCsp);
    }
  }, []);

  // --- Estados Persistidos (localStorage Robusto) ---
  const [lang, setLang] = useState(() => safeGetStorage('lang', 'pt'));
  const [isDarkMode, setIsDarkMode] = useState(() => safeGetStorage('theme', false));
  const [folders, setFolders] = useState(() => safeGetStorage('folders', [], 'folders'));
  const [items, setItems] = useState(() => safeGetStorage('items', [], 'items'));

  const t = translations[lang] || translations['pt'];

  const [toastMessage, setToastMessage] = useState('');

  // Sincronização segura
  useEffect(() => { safeSetStorage('lang', lang); }, [lang]);
  useEffect(() => { safeSetStorage('theme', isDarkMode); }, [isDarkMode]);
  useEffect(() => { safeSetStorage('folders', folders); }, [folders]);
  useEffect(() => { safeSetStorage('items', items); }, [items]);

  // Registro do callback de falha de cota
  useEffect(() => {
    quotaCallback = () => {
      setToastMessage(t.quotaError);
      setTimeout(() => setToastMessage(''), 5000);
    };
    return () => { quotaCallback = null; };
  }, [t]);

  // --- Estados da UI ---
  const [activeFolderId, setActiveFolderId] = useState('all');
  const [layout, setLayout] = useState('grid');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  // --- Lixeira ---
  const [deletedItems, setDeletedItems] = useState(() => safeGetStorage('deletedItems', [], 'items'));
   const [isTrashModalOpen, setIsTrashModalOpen] = useState(false);

  // Fechar modal da lixeira com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isTrashModalOpen) {
        setIsTrashModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isTrashModalOpen]);

  // Limpeza automática após 30 dias
  useEffect(() => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const cleaned = deletedItems.filter(item => (item.deletedAt || 0) > thirtyDaysAgo);
    if (cleaned.length !== deletedItems.length) {
      setDeletedItems(cleaned);
      safeSetStorage('deletedItems', cleaned);
    }
  }, [deletedItems]);

  // --- Novas Funcionalidades ---
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [showPurchased, setShowPurchased] = useState(true);

  // --- Estados de Seleção ---
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedFolders, setSelectedFolders] = useState([]);

  // --- Estados de Modais e Tokens ---
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isAddFolderModalOpen, setIsAddFolderModalOpen] = useState(false);
  const [isEditFolderModalOpen, setIsEditFolderModalOpen] = useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
    
  const [itemToDelete, setItemToDelete] = useState(null);

  // --- Formulários ---
  const [newItemForm, setNewItemForm] = useState({ title: '', description: '', url: '', imageUrl: '', folderId: '', price: '' });
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);


  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const numStr = priceStr.replace(/[^\d.,]/g, '').replace(',', '.');
    const num = parseFloat(numStr);
    return isNaN(num) ? 0 : num;
  };

  // --- Lógica Derivada e Filtragem ---
  const processedItems = useMemo(() => {
    let result = items;
    if (activeFolderId !== 'all') result = result.filter(item => item.folderId === activeFolderId);
    if (!showPurchased) result = result.filter(item => !item.isPurchased);

    if (searchQuery.trim()) {
      const q = removeAccents(searchQuery.toLowerCase());
      result = result.filter(item => {
        const folderName = folders.find(f => f.id === item.folderId)?.name || '';
        const titleNorm = removeAccents((item.title || '').toLowerCase());
        const descNorm = removeAccents((item.description || '').toLowerCase());
        const folderNorm = removeAccents(folderName.toLowerCase());
        return titleNorm.includes(q) || descNorm.includes(q) || folderNorm.includes(q);
      });
    }

    result = [...result].sort((a, b) => {
      if (a.isPurchased !== b.isPurchased) return a.isPurchased ? 1 : -1;
      switch(sortBy) {
        case 'nameAsc': return (a.title||'').localeCompare(b.title||'');
        case 'nameDesc': return (b.title||'').localeCompare(a.title||'');
        case 'priceAsc': return parsePrice(a.price) - parsePrice(b.price);
        case 'priceDesc': return parsePrice(b.price) - parsePrice(a.price);
        default: return (b.id||'').localeCompare(a.id||''); 
      }
    });

    return result;
  }, [items, activeFolderId, searchQuery, sortBy, showPurchased, folders]);

  const activeFolderName = activeFolderId === 'all' 
    ? t.allItems 
    : folders.find(f => f.id === activeFolderId)?.name || t.unknownFolder;

  const totalSelectedCount = selectedItems.length + selectedFolders.length;
  let isAllSelected = false;
  if (activeFolderId === 'all' && !searchQuery) {
    isAllSelected = (processedItems.length > 0 || folders.length > 0) && selectedItems.length === processedItems.length && selectedFolders.length === folders.length;
  } else {
    isAllSelected = processedItems.length > 0 && selectedItems.length === processedItems.length;
  }

  // --- Ações ---
  const handleSelectAll = useCallback(() => {
    if (activeFolderId === 'all' && !searchQuery) {
      if (isAllSelected) {
        setSelectedItems([]);
        setSelectedFolders([]);
      } else {
        setSelectedItems(processedItems.map(i => i.id));
        setSelectedFolders(folders.map(f => f.id));
      }
    } else {
      if (isAllSelected) {
        setSelectedItems(prev => prev.filter(id => !processedItems.find(i => i.id === id)));
      } else {
        const newSelection = new Set([...selectedItems, ...processedItems.map(i => i.id)]);
        setSelectedItems(Array.from(newSelection));
      }
    }
  }, [activeFolderId, searchQuery, isAllSelected, processedItems, folders, selectedItems]);

  const handleBulkDelete = useCallback(() => {
    // Mover itens selecionados para lixeira
    const itemsToDelete = items.filter(item => selectedItems.includes(item.id));
    const foldersToDelete = folders.filter(f => selectedFolders.includes(f.id));
    // Itens das pastas deletadas também vão para lixeira
    const itemsFromDeletedFolders = items.filter(item => selectedFolders.includes(item.folderId));
    const allDeletedItems = [...itemsToDelete, ...itemsFromDeletedFolders];
    if (allDeletedItems.length > 0) {
      setDeletedItems(prev => [...prev, ...allDeletedItems.map(i => ({ ...i, deletedAt: Date.now() }))]);
    }
    setItems(prev => prev.filter(item => !selectedItems.includes(item.id) && !selectedFolders.includes(item.folderId)));
    setFolders(prev => prev.filter(f => !selectedFolders.includes(f.id)));
    setSelectedItems([]);
    setSelectedFolders([]);
    if (selectedFolders.includes(activeFolderId)) setActiveFolderId('all');
    setToastMessage(`${allDeletedItems.length} itens movidos para a lixeira`);
    setTimeout(() => setToastMessage(''), 2000);
  }, [selectedItems, selectedFolders, activeFolderId, items, folders]);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
    setSelectedFolders([]);
  }, []);

  const handlePriceChange = useCallback((e) => {
    const val = e.target.value;
    if (/^[0-9R$€¥\s.,]*$/.test(val) && val.length <= 30) {
      setNewItemForm(prev => ({ ...prev, price: val }));
    }
  }, []);

  const handleAddItem = useCallback((e) => {
    e.preventDefault();
    
    // JS Fallback: Garante que os limites não sejam burlados
    const titleSafe = (newItemForm.title || '').substring(0, 100);
    const descSafe = (newItemForm.description || '').substring(0, 1000);
    const priceSafe = (newItemForm.price || '').substring(0, 30);

    const safeItemForm = {
      ...newItemForm,
      title: titleSafe,
      description: descSafe,
      price: priceSafe,
      url: getSafeUrl(newItemForm.url),
      imageUrl: getSafeImageUrl(newItemForm.imageUrl), // Hardening para Imagens Externas
    };

    if (editingItemId) {
      setItems(prev => prev.map(item => item.id === editingItemId ? { ...item, ...safeItemForm } : item));
      setIsEditItemModalOpen(false);
      setEditingItemId(null);
    } else {
      const newItem = {
        ...safeItemForm,
        id: Date.now().toString(),
        folderId: safeItemForm.folderId || (folders.length > 0 ? folders[0].id : 'unassigned'),
        isPurchased: false
      };
      setItems(prev => [newItem, ...prev]);
      setIsAddItemModalOpen(false);
    }
    setNewItemForm({ title: '', description: '', url: '', imageUrl: '', folderId: '', price: '' });
  }, [newItemForm, editingItemId, folders]);

const toggleItemPurchased = useCallback((id) => {
  setItems(prev => {
    const item = prev.find(i => i.id === id);
    const willBePurchased = !item?.isPurchased;
    if (willBePurchased) {
      simpleConfetti();
    }
    return prev.map(item => item.id === id ? { ...item, isPurchased: willBePurchased } : item);
  });
}, []);

  const openEditModal = (item) => {
    setNewItemForm({
      title: item.title || '', description: item.description || '', 
      url: item.url || '', imageUrl: item.imageUrl || '', 
      folderId: item.folderId || '', price: item.price || ''
    });
    setEditingItemId(item.id);
    setIsEditItemModalOpen(true);
  };

  const handleSingleDelete = () => {
    if (itemToDelete) {
      const item = items.find(i => i.id === itemToDelete);
      if (item) {
        // Mover para lixeira em vez de deletar permanentemente
        setDeletedItems(prev => [...prev, { ...item, deletedAt: Date.now() }]);
        setItems(prev => prev.filter(i => i.id !== itemToDelete));
        setSelectedItems(prev => prev.filter(id => id !== itemToDelete));
        setToastMessage('Item movido para a lixeira');
        setTimeout(() => setToastMessage(''), 2000);
      }
      setItemToDelete(null);
    }
  };

  const getFolderItemCount = useCallback((folderId) => items.filter(i => i.folderId === folderId).length, [items]);

  const handleSaveFolder = (e) => {
    e.preventDefault();
    // Limite estrito de JS (MaxLength=50)
    const folderNameSafe = (newFolderName || '').trim().substring(0, 50);
    if (!folderNameSafe) return;

    if (editingFolderId) {
      setFolders(prev => prev.map(f => f.id === editingFolderId ? { ...f, name: folderNameSafe } : f));
      setIsEditFolderModalOpen(false);
      setEditingFolderId(null);
    } else {
      const newFolder = { id: Date.now().toString(), name: folderNameSafe };
      setFolders(prev => [...prev, newFolder]);
      setIsAddFolderModalOpen(false);
      setActiveFolderId(newFolder.id);
    }
    setNewFolderName('');
  };

  const openEditFolderModal = (folder, e) => {
    e.stopPropagation();
    setNewFolderName(folder.name);
    setEditingFolderId(folder.id);
    setIsEditFolderModalOpen(true);
  };

  const handleDeleteFolder = (id, e) => {
    e.stopPropagation();
    setFolders(prev => prev.filter(f => f.id !== id));
    setItems(prev => prev.filter(item => item.folderId !== id)); 
    setSelectedFolders(prev => prev.filter(selectedId => selectedId !== id));
    if (activeFolderId === id) setActiveFolderId('all');
  };

  // UI Opcional: Bloqueio contra Clickjacking. Não quebra em visualização.
  if (isIframeBlocked) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900 text-center p-6">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md border border-red-200 dark:border-red-900/30">
           <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mx-auto mb-4">
             <IconWarning />
           </div>
           <h2 className="text-xl font-bold mt-4 text-gray-800 dark:text-gray-100">Acesso Bloqueado</h2>
           <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{t.iframeWarning}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100 font-sans overflow-hidden transition-colors duration-200">
        
        {/* Sidebar Mobile Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-800 dark:text-gray-100 flex items-end">
              {t.appTitle}
              <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full mb-1.5 ml-0.5"></div>
            </h1>
            <button className="md:hidden p-1 text-gray-500 dark:text-gray-400" onClick={() => setIsSidebarOpen(false)}>
              <IconX />
            </button>
          </div>

          <div className="p-4">
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">{t.menu}</p>
            <ul className="space-y-1">
              <li>
                <button 
                  onClick={() => { setActiveFolderId('all'); setIsSidebarOpen(false); }}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${activeFolderId === 'all' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                  <div className="mr-3"><IconGrid /></div>
                  <span className="flex-1 text-left">{t.allItems}</span>
                  <span className="text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 py-0.5 px-2 rounded-full">
                    {items.length}
                  </span>
                </button>
              </li>
            </ul>

            <div className="mt-8 mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{t.myFolders}</p>
              <div className="flex gap-1">
                <button onClick={() => setIsTrashModalOpen(true)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1" title="Lixeira">
                  <IconTrash />
                </button>
                <button onClick={() => setIsAddFolderModalOpen(true)} className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1" title={t.newFolder}>
                  <IconPlus />
                </button>
              </div>
            </div>
            
            <ul className="space-y-1 overflow-y-auto max-h-[40vh]">
              {folders.map(folder => (
                <li key={folder.id} className="group relative">
                  <button 
                    onClick={() => { setActiveFolderId(folder.id); setIsSidebarOpen(false); }}
                    className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors pr-20 ${activeFolderId === folder.id ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  >
                    <div className="mr-3 text-gray-400 dark:text-gray-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors"><IconFolder /></div>
                    <span className="truncate flex-1 text-left">{folder.name}</span>
                    <span className="text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 py-0.5 px-2 rounded-full group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                      {getFolderItemCount(folder.id)}
                    </span>
                  </button>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-900 pl-2 shadow-[-10px_0_10px_white] dark:shadow-[-10px_0_10px_#111827]">
                    <button 
                      onClick={(e) => openEditFolderModal(folder, e)}
                      className="p-1.5 text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-900/40"
                      title={t.edit}
                    >
                      <IconEdit />
                    </button>
                    <button 
                      onClick={(e) => handleDeleteFolder(folder.id, e)}
                      className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/40"
                      title={t.delete}
                    >
                      <IconTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Footer Controls (Settings) */}
          <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <div className="flex gap-2 relative">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {isDarkMode ? <IconSun /> : <IconMoon />}
              </button>
              
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <IconGlobe /> {lang.toUpperCase()}
              </button>

              {isLangMenuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsLangMenuOpen(false)}></div>
                  <div className="absolute bottom-full right-0 mb-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden z-40 animate-in fade-in zoom-in-95">
                    {['pt', 'en', 'es', 'fr', 'it', 'de', 'zh', 'ja', 'ru'].map(l => (
                      <button 
                        key={l}
                        onClick={() => { setLang(l); setIsLangMenuOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${lang === l ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium' : 'text-gray-700 dark:text-gray-300'}`}
                      >
                        {t.langNames[l]}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative">
          
          {/* Header */}
          {totalSelectedCount > 0 ? (
            <header className="h-16 flex items-center justify-between px-4 sm:px-8 bg-indigo-50 dark:bg-indigo-900/30 border-b border-indigo-100 dark:border-indigo-800 shrink-0 transition-colors">
              <div className="flex items-center gap-3">
                <button onClick={clearSelection} className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors">
                  <IconX />
                </button>
                <span className="font-semibold text-indigo-700 dark:text-indigo-300">
                  {totalSelectedCount} {t.selectedMsg}
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <button onClick={handleSelectAll} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 px-3 py-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                  {isAllSelected ? t.deselectAll : t.selectAll}
                </button>
                <button onClick={() => setIsBulkDeleteModalOpen(true)} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-sm">
                  <IconTrash /> <span className="hidden sm:inline">{t.deleteSelected}</span>
                </button>
              </div>
            </header>
          ) : (
            <header className="h-16 flex items-center justify-between px-4 sm:px-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shrink-0">
              <div className="flex items-center">
                <button className="md:hidden mr-4 text-gray-600 dark:text-gray-400" onClick={() => setIsSidebarOpen(true)}>
                  <IconMenu />
                </button>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">{activeFolderName}</h2>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Botão Exportar */}
                <button
                  onClick={() => {
                    const data = { folders, items };
                    const json = JSON.stringify(data, null, 2);
                    const blob = new Blob([json], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `wishlist_backup_${new Date().toISOString().slice(0,19)}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {t.export || 'Exportar'}
                </button>

                {/* Botão Importar (com input file escondido) */}
                <input
                  type="file"
                  id="import-file"
                  accept=".json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      try {
                        const imported = JSON.parse(ev.target?.result as string);
                        if (!imported.folders || !Array.isArray(imported.folders)) throw new Error('Formato inválido');
                        if (!imported.items || !Array.isArray(imported.items)) throw new Error('Formato inválido');
                        if (confirm(t.importConfirmMsg || 'Importar irá substituir todos os dados atuais. Continuar?')) {
                          setFolders(imported.folders);
                          setItems(imported.items);
                          setToastMessage(t.importSuccessMsg || 'Backup restaurado com sucesso!');
                          setTimeout(() => setToastMessage(''), 3000);
                        }
                      } catch (err) {
                        setToastMessage(t.invalidFileMsg || 'Arquivo inválido');
                        setTimeout(() => setToastMessage(''), 3000);
                      }
                      e.target.value = '';
                    };
                    reader.readAsText(file);
                  }}
                />
                <button
                  onClick={() => document.getElementById('import-file')?.click()}
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {t.import || 'Importar'}
                </button>

                <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                  <button 
                    onClick={() => setLayout('grid')} 
                    className={`p-1.5 rounded-md transition-colors ${layout === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                  >
                    <IconGrid />
                  </button>
                  <button 
                    onClick={() => setLayout('list')} 
                    className={`p-1.5 rounded-md transition-colors ${layout === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                  >
                    <IconList />
                  </button>
                </div>

                <button 
                  onClick={() => setIsAddItemModalOpen(true)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 rounded-xl font-medium transition-colors shadow-sm shadow-indigo-200 dark:shadow-none"
                >
                  <IconPlus /> <span className="hidden sm:inline">{t.add}</span>
                </button>
              </div>
            </header>
          )}

          {/* Ferramentas: Pesquisa e Filtros */}
          {(items.length > 0 || folders.length > 0) && (
            <div className="px-4 sm:px-8 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center shrink-0">
              <div className="relative w-full sm:max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <IconSearch />
                </div>
                <input 
                  type="text" 
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                />
              </div>
              <div className="flex w-full sm:w-auto items-center gap-3">
                <button 
                  onClick={() => setShowPurchased(!showPurchased)}
                  className={`text-sm font-medium px-3 py-2 rounded-xl transition-colors border ${showPurchased ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800' : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  {showPurchased ? t.hidePurchased : t.showPurchased}
                </button>
                <select 
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="flex-1 sm:flex-none text-sm px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                >
                  <option value="default">{t.sortDefault}</option>
                  <option value="nameAsc">{t.sortNameAsc}</option>
                  <option value="nameDesc">{t.sortNameDesc}</option>
                  <option value="priceAsc">{t.sortPriceAsc}</option>
                  <option value="priceDesc">{t.sortPriceDesc}</option>
                </select>
              </div>
            </div>
          )}

          {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-8">
            {/* Dashboard de Estatísticas */}
            {(items.length > 0 || folders.length > 0) && (
              <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.totalItems || 'Total de itens'}</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{items.length}</p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.purchased || 'Comprados'}</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{items.filter(i => i.isPurchased).length}</p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.pending || 'Pendentes'}</p>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{items.filter(i => !i.isPurchased).length}</p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.totalSpent || 'Total gasto (estimado)'}</p>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {(() => {
                      const total = items.reduce((acc, item) => acc + parsePrice(item.price), 0);
                      const symbol = t.currency || '';
                      // Formata o número sem forçar uma moeda específica
                      return `${symbol} ${total.toLocaleString()}`;
                    })()}
                  </p>
                </div>
              </div>
            )}

            {/* Visualização de Pastas no modo "Todos os Itens" (Se não houver pesquisa) */}
            {activeFolderId === 'all' && folders.length > 0 && !searchQuery && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <IconFolder /> {t.foldersCount} ({folders.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {folders.map(folder => {
                    const isSelected = selectedFolders.includes(folder.id);
                    return (
                      <div 
                        key={folder.id} 
                        onClick={() => setActiveFolderId(folder.id)} 
                        className={`relative flex flex-col items-center p-5 bg-white dark:bg-gray-900 rounded-2xl border ${isSelected ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/30 dark:bg-indigo-900/10' : 'border-gray-200 dark:border-gray-800'} hover:shadow-md cursor-pointer transition-all`}
                      >
                        <div className="absolute top-3 left-3 z-10" onClick={e => e.stopPropagation()}>
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-indigo-600 rounded border-gray-300 dark:border-gray-600 cursor-pointer" 
                            checked={isSelected} 
                            onChange={() => setSelectedFolders(prev => isSelected ? prev.filter(id => id !== folder.id) : [...prev, folder.id])} 
                          />
                        </div>
                        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-500 dark:text-indigo-400 mb-3">
                          <IconFolder />
                        </div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-center line-clamp-1 w-full">{folder.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{getFolderItemCount(folder.id)} {t.itemsCount}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cabeçalho para Itens */}
            {(activeFolderId === 'all' && folders.length > 0 && processedItems.length > 0 && !searchQuery) && (
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 border-t border-gray-200 dark:border-gray-800 pt-6">
                <IconGrid /> {t.allItems} ({processedItems.length})
              </h3>
            )}

            {/* Lista de Itens */}
            {processedItems.length === 0 ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-300 dark:text-indigo-400 mb-6">
                  {searchQuery ? <IconSearch /> : <IconFolder />}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{t.emptyTitle}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">{searchQuery ? 'Nenhum resultado para a sua pesquisa.' : t.emptyDesc}</p>
                {!searchQuery && (
                  <button 
                    onClick={() => setIsAddItemModalOpen(true)}
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-xl font-medium transition-colors"
                  >
                    {t.addFirst}
                  </button>
                )}
              </div>
            ) : (
              <div className={
                layout === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                  : "flex flex-col gap-4 max-w-4xl mx-auto"
              }>
                {processedItems.map(item => {
                  const isSelected = selectedItems.includes(item.id);
                  const safeImg = getSafeImageUrl(item.imageUrl);
                  
                  return (
                    <div 
                      key={item.id} 
                      className={`bg-white dark:bg-gray-900 rounded-2xl border overflow-hidden hover:shadow-lg dark:hover:shadow-indigo-900/20 transition-all group ${layout === 'list' ? 'flex flex-row' : 'flex flex-col h-full'} ${isSelected ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200 dark:border-gray-800'} ${item.isPurchased ? 'opacity-75 bg-gray-50 dark:bg-gray-800/50' : ''}`}
                    >
                      <div className={`${layout === 'list' ? 'w-40 sm:w-48 shrink-0' : 'w-full aspect-video sm:aspect-square'} bg-gray-100 dark:bg-gray-800 relative overflow-hidden`}>
                        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2" onClick={e => e.stopPropagation()}>
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer shadow-sm bg-white dark:bg-gray-800"
                            checked={isSelected}
                            onChange={() => setSelectedItems(prev => isSelected ? prev.filter(id => id !== item.id) : [...prev, item.id])}
                          />
                        </div>

                        {safeImg !== SAFE_PLACEHOLDER && safeImg !== '' ? (
                          <img src={safeImg} alt={item.title} referrerPolicy="no-referrer" className={`w-full h-full object-cover transition-transform ${isSelected ? 'scale-105' : ''} ${item.isPurchased ? 'grayscale opacity-70' : ''}`} onError={(e) => { e.target.onerror = null; e.target.src = SAFE_PLACEHOLDER; }} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 dark:bg-gray-800">
                            <IconExternalLink />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => openEditModal(item)}
                            className="p-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 rounded-full shadow-sm"
                            title={t.edit}
                          >
                            <IconEdit />
                          </button>
                          <button 
                            onClick={() => setItemToDelete(item.id)}
                            className="p-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-full shadow-sm"
                            title={t.delete}
                          >
                            <IconTrash />
                          </button>
                        </div>
                        {item.isPurchased && (
                          <div className="absolute bottom-2 right-2 bg-green-500/90 backdrop-blur text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
                            {t.purchased}
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4 sm:p-5 flex flex-col flex-1">
                        <div className="flex gap-2 items-start justify-between mb-1">
                          <h3 className={`font-bold text-gray-800 dark:text-gray-100 text-lg leading-tight line-clamp-2 ${item.isPurchased ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>{item.title}</h3>
                        </div>
                        {item.price && (
                          <p className={`font-semibold text-sm mb-2 ${item.isPurchased ? 'text-gray-500 dark:text-gray-500' : 'text-green-600 dark:text-green-400'}`}>{item.price}</p>
                        )}
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 flex-1 whitespace-normal break-words">{item.description}</p>
                        
                        <div className="mt-auto flex items-center justify-between gap-2">
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${item.isPurchased ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 group-hover:border-green-400'}`}>
                              {item.isPurchased && <IconCheck />}
                            </div>
                            <input 
                              type="checkbox" className="hidden" 
                              checked={item.isPurchased} 
                              onChange={() => toggleItemPurchased(item.id)}
                            />
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 hidden sm:block">{t.purchased}</span>
                          </label>

                          <a 
                            href={getSafeUrl(item.url)} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-gray-900 dark:bg-indigo-600 hover:bg-gray-800 dark:hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors ml-auto"
                          >
                            {t.visit} <IconExternalLink />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>

        {/* --- Modais --- */}

        {/* Modal Adicionar/Editar Item */}
        {(isAddItemModalOpen || isEditItemModalOpen) && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">{editingItemId ? t.editWish : t.addWish}</h2>
                <button 
                  onClick={() => { 
                    setIsAddItemModalOpen(false); 
                    setIsEditItemModalOpen(false); 
                    setEditingItemId(null); 
                    setNewItemForm({ title: '', description: '', url: '', imageUrl: '', folderId: '', price: '' }); 
                  }} 
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <IconX />
                </button>
              </div>
              <form onSubmit={handleAddItem} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.urlLabel}</label>
                  <input 
                    type="url" required
                    placeholder={t.urlPlaceholder} 
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    value={newItemForm.url} onChange={e => setNewItemForm({...newItemForm, url: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.nameLabel}</label>
                  <input 
                    type="text" required maxLength={100}
                    placeholder={t.namePlaceholder} 
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    value={newItemForm.title} onChange={e => setNewItemForm({...newItemForm, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.imgLabel}</label>
                  <input 
                    type="url"
                    placeholder={t.imgPlaceholder} 
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    value={newItemForm.imageUrl} onChange={e => setNewItemForm({...newItemForm, imageUrl: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.priceLabel}</label>
                    <input 
                      type="text" maxLength={30}
                      placeholder={t.pricePlaceholder} 
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      value={newItemForm.price || ''} onChange={handlePriceChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.folderLabel}</label>
                    <select 
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all appearance-none"
                      value={newItemForm.folderId || (folders.length > 0 ? folders[0].id : '')} 
                      onChange={e => setNewItemForm({...newItemForm, folderId: e.target.value})}
                    >
                      {folders.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.descLabel}</label>
                  <textarea 
                    rows="2" maxLength={1000}
                    placeholder={t.descPlaceholder} 
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                    value={newItemForm.description} onChange={e => setNewItemForm({...newItemForm, description: e.target.value})}
                  ></textarea>
                </div>
                <div className="pt-2">
                  <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-colors">
                    {editingItemId ? t.saveChanges : t.saveList}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Adicionar/Editar Pasta */}
        {(isAddFolderModalOpen || isEditFolderModalOpen) && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">{editingFolderId ? t.editFolder : t.newFolder}</h2>
                <button 
                  onClick={() => { 
                    setIsAddFolderModalOpen(false); 
                    setIsEditFolderModalOpen(false); 
                    setEditingFolderId(null); 
                    setNewFolderName(''); 
                  }} 
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <IconX />
                </button>
              </div>
              <form onSubmit={handleSaveFolder} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.folderNameLabel}</label>
                  <input 
                    type="text" required autoFocus maxLength={50}
                    placeholder={t.folderPlaceholder} 
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    value={newFolderName} onChange={e => setNewFolderName(e.target.value)}
                  />
                </div>
                <div className="pt-2 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => { 
                      setIsAddFolderModalOpen(false); 
                      setIsEditFolderModalOpen(false); 
                      setEditingFolderId(null); 
                      setNewFolderName(''); 
                    }} 
                    className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2.5 rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {t.cancel}
                  </button>
                  <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl transition-colors">
                    {editingFolderId ? t.save : t.create}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Confirmação de Exclusão Única */}
        {itemToDelete && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center text-red-500 dark:text-red-400 mx-auto mb-4">
                <IconTrash />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{t.confirmSingleDelete}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t.confirmSingleDeleteMsg}</p>
              <div className="flex gap-3">
                <button onClick={() => setItemToDelete(null)} className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors text-sm">
                  {t.cancel}
                </button>
                <button onClick={handleSingleDelete} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-xl transition-colors text-sm">
                  {t.yesDelete}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Confirmação de Exclusão em Massa */}
        {isBulkDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center text-red-500 dark:text-red-400 mx-auto mb-4">
                <IconTrash />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{t.confirmBulkDelete}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t.confirmDeleteMsg}</p>
              <div className="flex gap-3">
                <button onClick={() => setIsBulkDeleteModalOpen(false)} className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors text-sm">
                  {t.cancel}
                </button>
                <button onClick={() => { handleBulkDelete(); setIsBulkDeleteModalOpen(false); }} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-xl transition-colors text-sm">
                  {t.yesDelete}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal da Lixeira */}
        {isTrashModalOpen && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t.trashTitle || 'Lixeira'} ({deletedItems.length})</h2>
                <button onClick={() => setIsTrashModalOpen(false)} className="text-gray-400 hover:text-gray-600"><IconX /></button>
              </div>
              <div className="p-5 max-h-[60vh] overflow-y-auto">
                {deletedItems.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">{t.noItemsInTrash || 'Nenhum item na lixeira'}</p>
                ) : (
                  <div className="space-y-3">
                    {deletedItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-xl">
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-gray-100">{item.title}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Excluído em: {new Date(item.deletedAt).toLocaleString()}</p>
                        </div>
                        <button
                          onClick={() => {
                            setItems(prev => [...prev, { ...item, isPurchased: false, deletedAt: undefined }]);
                            setDeletedItems(prev => prev.filter(i => i.id !== item.id));
                            setToastMessage(t.itemRestored || 'Item restaurado');
                            setTimeout(() => setToastMessage(''), 2000);
                          }}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg"
                        >
                          {t.restore || 'Restaurar'}
                        </button>
                      </div>
                    ))}
                    {deletedItems.length > 0 && (
                      <button
                        onClick={() => {
                          if (confirm(t.confirmEmptyTrash || 'Esvaziar lixeira permanentemente?')) {
                            setDeletedItems([]);
                            setToastMessage(t.trashEmptied || 'Lixeira esvaziada');
                            setTimeout(() => setToastMessage(''), 2000);
                          }
                        }}
                        className="w-full mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium"
                      >
                        {t.emptyTrash || 'Esvaziar Lixeira'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
              <IconCheck />
            </div>
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        )}

      </div>
    </div>
  );
}