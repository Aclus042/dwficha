/**
 * =====================================================
 * DUNGEON WORLD - PÁGINA: SELEÇÃO DE CLASSE
 * Página inicial para escolher a classe do personagem
 * =====================================================
 */

const ClassSelectionPage = {
    /**
     * Inicializa a página de seleção de classe
     */
    init() {
        this.container = document.getElementById('app');
        this.render();
        this.attachEvents();
    },

    /**
     * Renderiza a página completa
     */
    render() {
        // Obtém o template
        const template = document.getElementById('template-class-selection');
        if (!template) {
            console.error('Template de seleção de classe não encontrado');
            return;
        }

        // Clona e insere o template
        const content = template.content.cloneNode(true);
        this.container.innerHTML = '';
        this.container.appendChild(content);

        // Renderiza os cartões de classe
        this.renderClassCards();

        // Configura botão de importar personagem
        this.setupImportButton();
    },

    /**
     * Configura o botão de importar personagem
     */
    setupImportButton() {
        const importBtn = document.querySelector('.import-character-btn');
        if (importBtn) {
            importBtn.addEventListener('click', () => this.importCharacter());
        }
    },

    /**
     * Importa personagem de arquivo
     */
    async importCharacter() {
        try {
            const character = await Store.importCharacter();
            if (character) {
                Store.navigateTo('character-sheet');
            }
        } catch (error) {
            this.showError(error.message || 'Erro ao importar personagem');
        }
    },

    /**
     * Renderiza os cartões de todas as classes
     */
    renderClassCards() {
        const grid = document.querySelector('.class-grid');
        if (!grid) {
            console.error('Grid de classes não encontrado');
            return;
        }

        const allClasses = getAllClasses();

        if (!allClasses || allClasses.length === 0) {
            console.error('Nenhuma classe encontrada!');
            grid.innerHTML = '<p class="text-center text-muted">Erro ao carregar classes.</p>';
            return;
        }
        
        const cards = ClassCard.renderList(allClasses);
        grid.appendChild(cards);
    },

    /**
     * Anexa eventos globais da página
     */
    attachEvents() {
        // Eventos globais podem ser adicionados aqui se necessário
    },

    /**
     * Mostra uma mensagem de erro
     * @param {string} message - Mensagem de erro
     */
    showError(message) {
        // Implementação simples de toast/notificação
        const toast = document.createElement('div');
        toast.className = 'toast toast-error';
        toast.textContent = message;
        toast.setAttribute('role', 'alert');
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('toast-visible');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('toast-visible');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    /**
     * Limpa a página
     */
    destroy() {
        // Remove event listeners se necessário
    }
};

// Exporta para uso global
if (typeof window !== 'undefined') {
    window.ClassSelectionPage = ClassSelectionPage;
}
