/**
 * =====================================================
 * DUNGEON WORLD - MODAL DA BIBLIOTECA DE EQUIPAMENTOS
 * Interface para visualizar, comprar e adicionar itens
 * =====================================================
 */

const EquipmentLibraryModal = {
    currentCategory: 'weapons',
    searchQuery: '',

    /**
     * Categorias disponíveis
     */
    CATEGORIES: {
        weapons: { label: 'Armas', icon: '⚔️' },
        armor: { label: 'Armaduras', icon: '🛡️' },
        equipment: { label: 'Equipamentos', icon: '🎒' },
        consumables: { label: 'Consumíveis', icon: '🧪' },
        poisons: { label: 'Venenos', icon: '☠️' },
        magicItems: { label: 'Itens Mágicos', icon: '✨' }
    },

    /**
     * Abre o modal da biblioteca
     */
    open() {
        this.currentCategory = 'weapons';
        this.searchQuery = '';
        this.render();
    },

    /**
     * Renderiza o modal
     */
    render() {
        // Remove modal anterior se existir
        const existingModal = document.getElementById('equipment-library-modal');
        if (existingModal) existingModal.remove();

        const character = Store.get('character');
        const coins = character?.coins || 0;

        const modal = document.createElement('div');
        modal.id = 'equipment-library-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-container library-modal">
                <div class="modal-header">
                    <h2 class="modal-title">📚 Biblioteca de Equipamentos</h2>
                    <div class="library-coins">
                        <span class="coins-icon">🪙</span>
                        <span class="coins-value">${coins}</span>
                        <span class="coins-label">moedas</span>
                    </div>
                    <button type="button" class="modal-close" id="close-library-modal">✕</button>
                </div>
                
                <div class="library-content">
                    <!-- Sidebar com categorias -->
                    <div class="library-sidebar">
                        <div class="library-search">
                            <input type="text" 
                                   id="library-search-input" 
                                   placeholder="Buscar itens..."
                                   value="${this.searchQuery}">
                        </div>
                        <nav class="library-categories">
                            ${Object.entries(this.CATEGORIES).map(([key, cat]) => `
                                <button type="button" 
                                        class="library-category-btn ${this.currentCategory === key ? 'active' : ''}"
                                        data-category="${key}">
                                    <span class="category-icon">${cat.icon}</span>
                                    <span class="category-label">${cat.label}</span>
                                    <span class="category-count">${EquipmentLibrary.getByCategory(key).length}</span>
                                </button>
                            `).join('')}
                        </nav>
                    </div>
                    
                    <!-- Lista de itens -->
                    <div class="library-items-container">
                        <div class="library-items-header">
                            <h3 class="library-items-title">
                                ${this.CATEGORIES[this.currentCategory]?.icon || '📦'} 
                                ${this.CATEGORIES[this.currentCategory]?.label || 'Itens'}
                            </h3>
                        </div>
                        <div class="library-items-list" id="library-items-list">
                            ${this.renderItems()}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.attachEvents(modal);
        
        // Adiciona classe active para exibir o modal (com pequeno delay para animação)
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });
        
        // Foca na busca
        setTimeout(() => {
            document.getElementById('library-search-input')?.focus();
        }, 100);
    },

    /**
     * Renderiza a lista de itens
     */
    renderItems() {
        let items;
        
        if (this.searchQuery) {
            items = EquipmentLibrary.search(this.searchQuery);
        } else {
            items = EquipmentLibrary.getByCategory(this.currentCategory);
        }

        if (items.length === 0) {
            return `
                <div class="library-empty">
                    <div class="library-empty-icon">📭</div>
                    <p>${this.searchQuery ? 'Nenhum item encontrado.' : 'Categoria vazia.'}</p>
                </div>
            `;
        }

        return items.map(item => this.renderItemCard(item)).join('');
    },

    /**
     * Renderiza um card de item da biblioteca
     */
    renderItemCard(item) {
        const character = Store.get('character');
        const coins = character?.coins || 0;
        const canAfford = coins >= item.price;

        return `
            <div class="library-item-card" data-item-id="${item.id}">
                <div class="library-item-main">
                    <div class="library-item-header">
                        <h4 class="library-item-name">${item.name}</h4>
                        <div class="library-item-price ${!canAfford ? 'cannot-afford' : ''}">
                            <span class="price-icon">🪙</span>
                            <span class="price-value">${item.price}</span>
                        </div>
                    </div>
                    
                    <div class="library-item-tags">
                        ${item.tags.map(tag => `<span class="library-tag ${this.getTagClass(tag)}">${tag}</span>`).join('')}
                    </div>
                    
                    <div class="library-item-stats">
                        ${item.damage ? `<span class="library-stat">⚔️ ${item.damage}${item.bonusDamage ? '+' + item.bonusDamage : ''}</span>` : ''}
                        ${item.armor ? `<span class="library-stat">🛡️ ${item.armor}</span>` : ''}
                        ${item.piercing ? `<span class="library-stat">🗡️ ${item.piercing} penetrante</span>` : ''}
                        <span class="library-stat">⚖️ ${item.weight}</span>
                        ${item.maxUses ? `<span class="library-stat">🔄 ${item.maxUses} usos</span>` : ''}
                    </div>
                    
                    ${item.description ? `<p class="library-item-desc">${item.description}</p>` : ''}
                </div>
                
                <div class="library-item-actions">
                    <button type="button" 
                            class="btn btn-sm btn-buy ${!canAfford ? 'disabled' : ''}"
                            data-action="buy"
                            data-item-id="${item.id}"
                            ${!canAfford ? 'disabled' : ''}>
                        🪙 Comprar
                    </button>
                    <button type="button" 
                            class="btn btn-sm btn-add"
                            data-action="add"
                            data-item-id="${item.id}">
                        ➕ Adicionar
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * Anexa eventos ao modal
     */
    attachEvents(modal) {
        // Fechar modal
        modal.querySelector('#close-library-modal').addEventListener('click', () => {
            this.close();
        });

        // Fechar ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.close();
        });

        // ESC para fechar
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                this.close();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        // Categorias
        modal.querySelectorAll('.library-category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentCategory = btn.dataset.category;
                this.searchQuery = '';
                document.getElementById('library-search-input').value = '';
                this.updateItemsList();
                
                // Atualiza botão ativo
                modal.querySelectorAll('.library-category-btn').forEach(b => 
                    b.classList.toggle('active', b === btn)
                );
                
                // Atualiza título
                const cat = this.CATEGORIES[this.currentCategory];
                modal.querySelector('.library-items-title').innerHTML = 
                    `${cat.icon} ${cat.label}`;
            });
        });

        // Busca
        const searchInput = document.getElementById('library-search-input');
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.searchQuery = e.target.value.trim();
                this.updateItemsList();
            }, 300);
        });

        // Ações nos itens (comprar/adicionar)
        modal.querySelector('.library-items-list').addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;

            const action = btn.dataset.action;
            const itemId = btn.dataset.itemId;

            if (action === 'buy') {
                this.buyItem(itemId);
            } else if (action === 'add') {
                this.addItem(itemId);
            }
        });
    },

    /**
     * Atualiza apenas a lista de itens
     */
    updateItemsList() {
        const list = document.getElementById('library-items-list');
        if (list) {
            list.innerHTML = this.renderItems();
        }
    },

    /**
     * Atualiza o display de moedas
     */
    updateCoinsDisplay() {
        const character = Store.get('character');
        const coins = character?.coins || 0;
        const coinsValue = document.querySelector('.library-coins .coins-value');
        if (coinsValue) {
            coinsValue.textContent = coins;
        }
        // Atualiza também os botões de comprar
        this.updateItemsList();
    },

    /**
     * Compra um item (reduz moedas e adiciona ao inventário)
     */
    buyItem(itemId) {
        const item = EquipmentLibrary.getById(itemId);
        if (!item) return;

        const character = Store.get('character');
        if (!character) return;

        const coins = character.coins || 0;

        if (coins < item.price) {
            this.showNotification('Moedas insuficientes!', 'error');
            return;
        }

        // Reduz moedas
        Store.setCharacterProperty('coins', coins - item.price);

        // Adiciona ao inventário
        this.addItemToInventory(item);

        // Atualiza UI
        this.updateCoinsDisplay();
        this.showNotification(`${item.name} comprado!`, 'success');
    },

    /**
     * Adiciona um item ao inventário (sem custo)
     */
    addItem(itemId) {
        const item = EquipmentLibrary.getById(itemId);
        if (!item) return;

        this.addItemToInventory(item);
        this.showNotification(`${item.name} adicionado ao inventário!`, 'success');
    },

    /**
     * Adiciona item ao inventário do personagem
     */
    addItemToInventory(libraryItem) {
        const character = Store.get('character');
        if (!character) return;

        // Cria uma cópia do item com ID único
        const newItem = {
            id: `${libraryItem.id}-${Date.now()}`,
            name: libraryItem.name,
            type: libraryItem.type,
            tags: [...libraryItem.tags],
            weight: libraryItem.weight,
            damage: libraryItem.damage || null,
            armor: libraryItem.armor || 0,
            piercing: libraryItem.piercing || 0,
            maxUses: libraryItem.maxUses || 0,
            currentUses: libraryItem.maxUses || 0,
            equipped: false,
            description: libraryItem.description || ''
        };

        const inventory = [...(character.inventory || []), newItem];
        Store.setCharacterProperty('inventory', inventory);

        // Dispara evento para atualizar a UI do inventário
        document.dispatchEvent(new CustomEvent('inventoryUpdated'));
    },

    /**
     * Mostra notificação
     */
    showNotification(message, type = 'info') {
        // Remove notificação anterior
        const existing = document.querySelector('.library-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `library-notification ${type}`;
        notification.innerHTML = `
            <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
            <span class="notification-message">${message}</span>
        `;

        const modal = document.getElementById('equipment-library-modal');
        if (modal) {
            modal.querySelector('.modal-container').appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('fade-out');
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }
    },

    /**
     * Fecha o modal
     */
    close() {
        const modal = document.getElementById('equipment-library-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    },

    /**
     * Classifica uma tag para aplicar estilo apropriado
     */
    getTagClass(tag) {
        const tagLower = tag.toLowerCase();
        
        // Tags de dano: +x dano, +x de dano
        if (tagLower.match(/^\+\d+\s*(de\s*)?dano/)) {
            return 'tag-damage';
        }
        
        // Tags de penetração: penetrante x, x penetrante
        if (tagLower.includes('penetrante')) {
            return 'tag-piercing';
        }
        
        // Tags de combate corpo a corpo
        if (tagLower.includes('corpo a corpo') || tagLower === 'mão') {
            return 'tag-melee';
        }
        
        // Tags de alcance/distância
        if (['perto', 'próximo', 'longe', 'distante', 'alcance', 'arremesso'].some(t => tagLower.includes(t))) {
            return 'tag-range';
        }
        
        // Tags de munição
        if (tagLower.includes('munição')) {
            return 'tag-ammo';
        }
        
        // Tags de usos
        if (tagLower.match(/\d+\s*uso/)) {
            return 'tag-uses';
        }
        
        // Tags de precisão
        if (tagLower.includes('preciso') || tagLower.includes('precisa')) {
            return 'tag-precise';
        }
        
        // Tags de duas mãos
        if (tagLower.includes('duas mãos') || tagLower.includes('2 mãos')) {
            return 'tag-twohands';
        }
        
        // Tags de recarga
        if (tagLower.includes('recarga')) {
            return 'tag-reload';
        }
        
        // Tags de armadura (vestida, desengonçada, etc.)
        if (tagLower.includes('vestida') || tagLower.includes('desengonçada')) {
            return 'tag-armor-mod';
        }
        
        // Tags de armadura numeradas
        if (tagLower.match(/^armadura\s*\+?\d/)) {
            return 'tag-armor';
        }
        
        return '';
    }
};

// Exporta globalmente
window.EquipmentLibraryModal = EquipmentLibraryModal;
