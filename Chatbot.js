// Initialisation du chatbot
// Ce script suppose que l'HTML du chatbot est déjà présent dans la page

document.addEventListener('DOMContentLoaded', function() {
    const chatContainer = document.getElementById('chatbot-container');
    const chatIcon = document.getElementById('chat-icon');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const closeBtn = document.getElementById('close-chat');

    // Vérifier si les éléments existent
    if (!chatContainer || !chatIcon || !chatMessages || !userInput || !sendBtn || !closeBtn) {
        return;
    }

    // Ouvrir/fermer le chat
    function toggleChat() {
        chatContainer.classList.toggle('open');
        chatIcon.classList.toggle('hidden');
    }

    chatIcon.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    // Envoyer un message
    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            addMessage('user', message);
            userInput.value = '';

            // Simuler une réponse après un délai
            setTimeout(() => {
                const response = getBotResponse(message);
                addMessage('bot', response);
            }, 1000);
        }
    }

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });

    // Ajouter un message au chat
    function addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;

        const now = new Date();
        const timeString = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

        messageDiv.innerHTML = `
      ${text}
      <span class="message-time">${timeString}</span>
    `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Générer une réponse du bot
    function getBotResponse(message) {
        const lowerCaseMessage = message.toLowerCase();

        // Salutations
        if (lowerCaseMessage.includes('bonjour') || lowerCaseMessage.includes('salut') ||
            lowerCaseMessage.includes('coucou') || lowerCaseMessage.includes('hello')) {
            return 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?';
        }

        // Commandes
        if (lowerCaseMessage.includes('commande') || lowerCaseMessage.includes('suivi')) {
            return 'Pour suivre votre commande, veuillez vous rendre dans la section "Mes commandes" de votre compte. Vous pouvez aussi me fournir votre numéro de commande.';
        }

        // Retours
        if (lowerCaseMessage.includes('retour') || lowerCaseMessage.includes('remboursement') ||
            lowerCaseMessage.includes('échanger')) {
            return 'Nous acceptons les retours sous 30 jours. Veuillez consulter notre politique de retours sur la page <a href="terms.html">Conditions de retour</a>.';
        }

        // Contact
        if (lowerCaseMessage.includes('contact') || lowerCaseMessage.includes('service client') ||
            lowerCaseMessage.includes('aide')) {
            return 'Vous pouvez contacter notre service client par email à support@marketplace.com ou par téléphone au +243 000 000 000 (9h-18h, lundi-vendredi).';
        }

        // Livraison
        if (lowerCaseMessage.includes('livraison') || lowerCaseMessage.includes('délai')) {
            return 'Les délais de livraison sont de 2-5 jours ouvrés pour Kinshasa et 5-10 jours pour le reste du pays.';
        }

        // Paiement
        if (lowerCaseMessage.includes('paiement') || lowerCaseMessage.includes('pay')) {
            return 'Nous acceptons les cartes Visa/Mastercard, Mobile Money (M-Pesa, Airtel, etc.) et paiement à la livraison.';
        }

        // Compte
        if (lowerCaseMessage.includes('compte') || lowerCaseMessage.includes('connexion')) {
            return 'Vous pouvez gérer votre compte dans la section <a href="account.html">Mon compte</a>. Pour réinitialiser votre mot de passe, cliquez sur "Mot de passe oublié" sur la page de connexion.';
        }

        // Produits
        if (lowerCaseMessage.includes('produit') || lowerCaseMessage.includes('article')) {
            return 'Vous pouvez rechercher des produits en utilisant la barre de recherche en haut de la page ou parcourir nos différentes catégories.';
        }

        // Remerciements
        if (lowerCaseMessage.includes('merci') || lowerCaseMessage.includes('remerc')) {
            return 'Je vous en prie ! N\'hésitez pas si vous avez d\'autres questions. 😊';
        }

        // Réponse par défaut
        return "Je n'ai pas bien compris votre demande. Pouvez-vous reformuler ou choisir une option ci-dessous ?<br><br>" +
            "1. Suivi de commande<br>" +
            "2. Politique de retour<br>" +
            "3. Contact service client<br>" +
            "4. Options de paiement";
    }

    // Message de bienvenue
    setTimeout(() => {
        addMessage('bot', 'Bonjour ! 👋 Je suis votre assistant virtuel MarketPlace. Comment puis-je vous aider aujourd\'hui ?');
    }, 1000);
});