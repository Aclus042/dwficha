/**
 * =====================================================
 * DUNGEON WORLD - ROUTER
 * Gerencia navegação entre páginas
 * =====================================================
 */

const Router = {
    // Registro de páginas
    pages: {
        'class-selection': ClassSelectionPage,
        'character-sheet': CharacterSheetPage
    },

    // Página atual
    currentPage: null,

    /**
     * Inicializa o router
     */
    init() {
        // Inscreve-se para mudanças de estado
        Store.subscribe((newState, oldState) => {
            if (newState.currentPage !== oldState?.currentPage) {
                this.navigate(newState.currentPage);
            }
        });

        // Verifica URL hash para navegação direta
        this.handleHashChange();
        
        // Escuta mudanças de hash
        window.addEventListener('hashchange', () => this.handleHashChange());

        // Navega para a página inicial
        const initialPage = Store.get('currentPage') || 'class-selection';
        this.navigate(initialPage);
    },

    /**
     * Navega para uma página
     * @param {string} pageName - Nome da página
     */
    navigate(pageName) {
        // Destrói página atual se existir
        if (this.currentPage && typeof this.currentPage.destroy === 'function') {
            this.currentPage.destroy();
        }

        // Obtém a nova página
        const page = this.pages[pageName];
        
        if (!page) {
            console.error(`Página não encontrada: ${pageName}`);
            this.navigate('class-selection');
            return;
        }

        // Atualiza hash da URL
        window.location.hash = pageName;

        // Inicializa a nova página
        this.currentPage = page;
        
        // Adiciona classe ao body para estilos específicos da página
        document.body.className = `page-${pageName}`;
        
        // Animação de transição
        const app = document.getElementById('app');
        app.classList.add('page-transition');
        
        // Reseta o scroll para o topo ao mudar de página
        window.scrollTo(0, 0);
        
        // Inicializa a página
        page.init();
        
        // Remove classe de transição após animação
        setTimeout(() => {
            app.classList.remove('page-transition');
        }, 300);
    },

    /**
     * Manipula mudanças no hash da URL
     */
    handleHashChange() {
        const hash = window.location.hash.slice(1);
        
        if (hash && this.pages[hash]) {
            // Verifica se pode navegar para a ficha (precisa ter personagem)
            if (hash === 'character-sheet' && !Store.get('character')) {
                // Tenta carregar do storage
                const savedCharacters = Store.get('savedCharacters');
                if (savedCharacters && savedCharacters.length > 0) {
                    // Tem personagens salvos, deixa ir para seleção
                    Store.set({ currentPage: 'class-selection' });
                } else {
                    Store.set({ currentPage: 'class-selection' });
                }
            } else {
                Store.set({ currentPage: hash });
            }
        }
    },

    /**
     * Retorna para a página anterior
     */
    back() {
        window.history.back();
    },

    /**
     * Registra uma nova página
     * @param {string} name - Nome da página
     * @param {Object} page - Objeto da página
     */
    register(name, page) {
        this.pages[name] = page;
    }
};

// Exporta para uso global
if (typeof window !== 'undefined') {
    window.Router = Router;
}
