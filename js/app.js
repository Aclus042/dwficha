/**
 * =====================================================
 * DUNGEON WORLD - APLICAÇÃO PRINCIPAL
 * Ponto de entrada da aplicação
 * =====================================================
 */

const App = {
    /**
     * Inicializa a aplicação
     */
    init() {
        // Aguarda o DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.bootstrap());
        } else {
            this.bootstrap();
        }
    },

    /**
     * Bootstrap da aplicação
     */
    bootstrap() {
        try {
            // Inicializa componentes base
            this.initializeComponents();
            
            // Configura eventos globais
            this.setupGlobalEvents();
            
            // Inicializa o router
            Router.init();
        } catch (error) {
            console.error('❌ Erro ao iniciar aplicação:', error);
            this.showFatalError(error);
        }
    },

    /**
     * Inicializa componentes base
     */
    initializeComponents() {
        // Verifica se todos os componentes estão disponíveis
        const requiredComponents = [
            'Store',
            'Helpers',
            'BASIC_MOVES',
            'SPECIAL_MOVES',
            'CLASSES',
            'ClassCard',
            'MovementCard',
            'InventoryItem',
            'ClassSelectionPage',
            'CharacterSheetPage',
            'Router'
        ];

        const missing = requiredComponents.filter(name => !window[name]);
        
        if (missing.length > 0) {
            throw new Error(`Componentes não encontrados: ${missing.join(', ')}`);
        }
    },

    /**
     * Configura eventos globais
     */
    setupGlobalEvents() {
        // Previne perda de dados ao fechar a página
        window.addEventListener('beforeunload', (e) => {
            if (Store.get('hasUnsavedChanges')) {
                e.preventDefault();
                e.returnValue = 'Você tem alterações não salvas. Deseja sair mesmo assim?';
                return e.returnValue;
            }
        });

        // Tratamento global de erros
        window.addEventListener('error', (e) => {
            console.error('Erro global:', e.error);
        });

        // Tratamento de promessas rejeitadas
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Promessa rejeitada:', e.reason);
        });

        // Atalhos de teclado globais
        document.addEventListener('keydown', (e) => {
            // ESC para fechar modais/popups
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Eventos customizados podem ser adicionados aqui se necessário
    },

    /**
     * Fecha todos os modais abertos
     */
    closeAllModals() {
        document.querySelectorAll('.modal.modal-open').forEach(modal => {
            modal.classList.remove('modal-open');
        });
    },

    /**
     * Mostra erro fatal
     * @param {Error} error - Erro ocorrido
     */
    showFatalError(error) {
        const app = document.getElementById('app');
        if (app) {
            app.innerHTML = `
                <div class="fatal-error">
                    <div class="fatal-error-content">
                        <h1>⚠️ Erro ao Carregar</h1>
                        <p>Ocorreu um erro ao iniciar a aplicação.</p>
                        <p class="error-details">${error.message}</p>
                        <button onclick="location.reload()" class="btn btn-primary">
                            Tentar Novamente
                        </button>
                    </div>
                </div>
            `;
        }
    },

    /**
     * Utilitário para debug (ativado no console)
     */
    debug() {
        console.log('=== DEBUG ===');
        console.log('Estado:', Store.get());
        console.log('Personagem:', Store.get('character'));
        console.log('Classes:', getAllClasses().map(c => c.name));
        console.log('=============');
    }
};

// Auto-inicia a aplicação
App.init();

// Expõe para debug
if (typeof window !== 'undefined') {
    window.App = App;
    window.debug = () => App.debug();
}
