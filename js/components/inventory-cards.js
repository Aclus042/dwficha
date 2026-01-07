/**
 * =====================================================
 * DUNGEON WORLD - INVENTÁRIO ESTILO RPG/MMO
 * Grid fixo de cards compactos tipo slot de inventário
 * =====================================================
 */

const InventoryCards = {
    // Tipos de itens
    ITEM_TYPES: {
        weapon: { icon: '⚔️', label: 'Arma', class: 'type-weapon' },
        armor: { icon: '🛡️', label: 'Armadura', class: 'type-armor' },
        consumable: { icon: '🧪', label: 'Consumível', class: 'type-consumable' },
        equipment: { icon: '🎒', label: 'Equipamento', class: 'type-equipment' },
        treasure: { icon: '💰', label: 'Tesouro', class: 'type-treasure' },
        general: { icon: '📦', label: 'Geral', class: 'type-general' }
    },

    /**
     * Detecta o tipo de um item baseado em suas propriedades
     */
    detectItemType(item) {
        const tags = (item.tags || []).map(t => t.toLowerCase());
        const name = (item.name || '').toLowerCase();

        // Armadura
        if (item.armor > 0 || tags.some(t => t.includes('armadura'))) {
            return 'armor';
        }

        // Arma
        if (tags.some(t => 
            t.includes('dano') || t.includes('mão') || t.includes('corpo a corpo') || 
            t.includes('alcance') || t.includes('próximo') || t.includes('perto') || 
            t.includes('longe') || t.includes('penetrante') || t.includes('precisa')
        )) {
            return 'weapon';
        }

        // Consumível
        if (item.maxUses > 0 || item.uses !== undefined || 
            tags.some(t => t.match(/\d+\s*uso/i) || t.includes('aplicação') || t.includes('dose'))) {
            return 'consumable';
        }

        // Tesouro
        if (tags.some(t => t.includes('moeda') || t.includes('ouro')) || name.includes('tesouro')) {
            return 'treasure';
        }

        // Equipamento
        if (tags.some(t => t.includes('peso') || t.includes('ração') || t.includes('tocha'))) {
            return 'equipment';
        }

        return 'general';
    },

    /**
     * Extrai número de usos das tags
     */
    extractUsesFromTags(tags) {
        for (const tag of tags) {
            const match = tag.match(/(\d+)\s*uso/i);
            if (match) return parseInt(match[1]);
        }
        return 0;
    },

    /**
     * Inicializa usos se necessário
     */
    initializeItemUses(item) {
        if (item.maxUses !== undefined) return item;
        
        const usesFromTags = this.extractUsesFromTags(item.tags || []);
        if (usesFromTags > 0) {
            return {
                ...item,
                maxUses: usesFromTags,
                currentUses: item.currentUses !== undefined ? item.currentUses : usesFromTags
            };
        }
        return item;
    },

    /**
     * Renderiza um item como tag compacta
     */
    renderCard(item, options = {}) {
        const { editable = true, showDelete = true } = options;
        
        item = this.initializeItemUses(item);
        
        const itemType = this.detectItemType(item);
        const typeInfo = this.ITEM_TYPES[itemType];
        const isDepleted = item.maxUses > 0 && item.currentUses === 0;
        const isEquipped = item.equipped;
        const canEquip = itemType === 'weapon' || itemType === 'armor';
        const isStartingEquipment = item.isStartingEquipment || false;

        const card = document.createElement('div');
        card.className = `item-card ${isDepleted ? 'depleted' : ''} ${isEquipped ? 'equipped' : ''} ${isStartingEquipment ? 'starting-equipment' : ''}`;
        card.dataset.itemId = item.id;
        card.dataset.itemType = itemType;

        // Bolinhas de uso inline
        let usesHtml = '';
        if (item.maxUses > 0) {
            const dots = [];
            for (let i = 0; i < item.maxUses; i++) {
                const isAvailable = i < (item.currentUses || 0);
                dots.push(`<div class="use-dot ${isAvailable ? 'available' : 'used'}" data-dot-index="${i}"></div>`);
            }
            usesHtml = `<div class="item-uses-inline">${dots.join('')}</div>`;
        }

        // Stats inline
        let statsHtml = '';
        if (item.armor > 0) {
            statsHtml += `<span class="item-stat-inline stat-armor">🛡${item.armor}</span>`;
        }

        // Info secundária
        const secondaryParts = [];
        if (item.weight > 0) secondaryParts.push(`⚖${item.weight}`);
        if (statsHtml) secondaryParts.push(statsHtml);
        
        const secondaryHtml = secondaryParts.length > 0 
            ? `<div class="item-info-secondary">${secondaryParts.join('<span class="separator">•</span>')}</div>`
            : '';

        // Tags do item para tooltip
        const itemTags = item.tags && item.tags.length > 0 ? item.tags.join(', ') : '';
        const tooltipText = itemTags ? `${item.name}\n${itemTags}` : item.name;

        card.innerHTML = `
            ${canEquip ? `
                <button type="button" class="btn-equip-marker ${isEquipped ? 'equipped' : ''}" 
                        title="${isEquipped ? 'Desequipar' : 'Equipar'}">
                    ${isEquipped ? '✓' : ''}
                </button>
            ` : ''}
            
            <div class="item-card-content">
                <span class="item-card-name">${this.escapeHtml(item.name)}</span>
                ${secondaryHtml}
                ${usesHtml}
            </div>
            
            <!-- Tooltip com tags do item -->
            ${itemTags ? `<div class="item-tags-tooltip">${itemTags}</div>` : ''}
            
            ${showDelete && !isStartingEquipment ? `<button type="button" class="btn-delete" title="Remover">✕</button>` : ''}
            
            ${isDepleted ? `
                <div class="item-depleted-overlay">
                    <span class="item-depleted-text">Esgotado</span>
                    <button type="button" class="btn-restore-uses">Restaurar</button>
                </div>
            ` : ''}
        `;

        if (editable) {
            this.attachCardEvents(card, item);
        }

        return card;
    },

    /**
     * Anexa eventos ao card
     */
    attachCardEvents(card, item) {
        // Equipar (marcador circular na lateral)
        const equipBtn = card.querySelector('.btn-equip-marker');
        equipBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleEquip(item.id);
        });

        // Deletar
        const deleteBtn = card.querySelector('.btn-delete');
        deleteBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.removeItem(item.id);
        });

        // Bolinhas de uso
        card.querySelectorAll('.use-dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleUse(item.id, parseInt(dot.dataset.dotIndex));
            });
        });

        // Restaurar usos
        const restoreBtn = card.querySelector('.btn-restore-uses');
        restoreBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.restoreAllUses(item.id);
        });

        // Clique no card abre detalhes
        card.addEventListener('click', () => {
            this.openItemDetail(item.id);
        });
    },

    /**
     * Alterna uso
     */
    toggleUse(itemId, dotIndex) {
        const character = Store.get('character');
        if (!character) return;

        const item = character.inventory.find(i => i.id === itemId);
        if (!item) return;

        // Inicializa currentUses se necessário
        if (item.currentUses === undefined) {
            item.currentUses = item.maxUses || 0;
        }

        // Toggle: se clicou numa disponível, marca como usada; se clicou numa usada, restaura
        if (dotIndex < item.currentUses) {
            item.currentUses = dotIndex;
        } else {
            item.currentUses = dotIndex + 1;
        }

        this.updateItem(itemId, { currentUses: item.currentUses });
        this.refreshCard(itemId);
    },

    /**
     * Restaura todos os usos
     */
    restoreAllUses(itemId) {
        const character = Store.get('character');
        if (!character) return;

        const item = character.inventory.find(i => i.id === itemId);
        if (!item || !item.maxUses) return;

        this.updateItem(itemId, { currentUses: item.maxUses });
        this.refreshCard(itemId);
    },

    /**
     * Atualiza card visualmente
     */
    refreshCard(itemId) {
        const character = Store.get('character');
        if (!character) return;

        const item = character.inventory.find(i => i.id === itemId);
        if (!item) return;

        const oldCard = document.querySelector(`[data-item-id="${itemId}"]`);
        if (!oldCard) return;

        const newCard = this.renderCard(item, { editable: true, showDelete: true });
        oldCard.replaceWith(newCard);
    },

    /**
     * Renderiza inventário completo agrupado por categoria
     */
    renderInventory(items = [], options = {}) {
        const container = document.createElement('div');
        container.className = 'inventory-cards-wrapper';

        // Inicializa usos
        items = items.map(item => this.initializeItemUses(item));

        // Stats
        const stats = this.calculateStats(items);
        const calculated = Store.getCalculatedValues();
        const isOverEncumbered = stats.totalWeight > (calculated?.maxLoad || 999);

        // Agrupa itens por categoria
        const categories = {
            weapon: { label: 'Armas', icon: '⚔️', items: [] },
            armor: { label: 'Armaduras', icon: '🛡️', items: [] },
            consumable: { label: 'Consumíveis', icon: '🧪', items: [] },
            equipment: { label: 'Equipamentos', icon: '🎒', items: [] },
            treasure: { label: 'Tesouros', icon: '💰', items: [] },
            general: { label: 'Outros', icon: '📦', items: [] }
        };

        items.forEach(item => {
            const type = this.detectItemType(item);
            if (categories[type]) {
                categories[type].items.push(item);
            } else {
                categories.general.items.push(item);
            }
        });

        container.innerHTML = `
            <!-- Resumo -->
            <div class="inventory-summary">
                <div class="inventory-summary-stat ${isOverEncumbered ? 'over-encumbered' : ''}">
                    <span class="inventory-summary-value">${stats.totalWeight}</span>
                    <span class="inventory-summary-label">Peso</span>
                </div>
                <div class="inventory-summary-stat">
                    <span class="inventory-summary-value">${calculated?.maxLoad || '-'}</span>
                    <span class="inventory-summary-label">Máx</span>
                </div>
                <div class="inventory-summary-stat">
                    <span class="inventory-summary-value">${stats.totalArmor}</span>
                    <span class="inventory-summary-label">Armadura</span>
                </div>
                <div class="inventory-summary-stat">
                    <span class="inventory-summary-value">${items.length}</span>
                    <span class="inventory-summary-label">Itens</span>
                </div>
            </div>
            
            <!-- Container de categorias -->
            <div class="inventory-categories-container" id="inventory-categories"></div>
        `;

        const categoriesContainer = container.querySelector('#inventory-categories');

        if (items.length === 0) {
            categoriesContainer.innerHTML = `
                <div class="inventory-empty-state">
                    <div class="inventory-empty-icon">🎒</div>
                    <h3 class="inventory-empty-title">Inventário Vazio</h3>
                    <p class="inventory-empty-text">Adicione itens ao seu inventário.</p>
                </div>
            `;
        } else {
            // Renderiza cada categoria que tenha itens
            Object.entries(categories).forEach(([typeKey, category]) => {
                if (category.items.length === 0) return;

                const categoryGroup = document.createElement('div');
                categoryGroup.className = 'inventory-category-group';
                categoryGroup.dataset.category = typeKey;

                categoryGroup.innerHTML = `
                    <div class="inventory-category-title">
                        <span class="category-icon">${category.icon}</span>
                        <span class="category-label">${category.label}</span>
                        <span class="category-count">${category.items.length}</span>
                    </div>
                    <div class="inventory-category-items"></div>
                `;

                const itemsContainer = categoryGroup.querySelector('.inventory-category-items');
                category.items.forEach(item => {
                    itemsContainer.appendChild(this.renderCard(item, options));
                });

                categoriesContainer.appendChild(categoryGroup);
            });
        }

        return container;
    },

    /**
     * Calcula estatísticas
     */
    calculateStats(items) {
        let totalWeight = 0;
        let totalArmor = 0;

        items.forEach(item => {
            const qty = item.quantity || 1;
            totalWeight += (item.weight || 0) * qty;
            
            if (item.equipped && item.armor) {
                totalArmor += item.armor;
            }
        });

        return { totalWeight, totalArmor };
    },

    /**
     * Atualiza item no Store
     */
    updateItem(itemId, updates) {
        const character = Store.get('character');
        if (!character) return;

        const inventory = character.inventory.map(item => 
            item.id === itemId ? { ...item, ...updates } : item
        );
        
        Store.setCharacterProperty('inventory', inventory);
    },

    /**
     * Remove item
     */
    removeItem(itemId) {
        const character = Store.get('character');
        if (!character) return;

        const card = document.querySelector(`[data-item-id="${itemId}"]`);
        if (card) {
            card.classList.add('removing');
            setTimeout(() => {
                const inventory = character.inventory.filter(item => item.id !== itemId);
                Store.setCharacterProperty('inventory', inventory);
                
                // Verifica se a categoria ficou vazia
                const categoryGroup = card.closest('.inventory-category-group');
                card.remove();
                
                if (categoryGroup) {
                    const remainingItems = categoryGroup.querySelectorAll('.item-card');
                    if (remainingItems.length === 0) {
                        categoryGroup.remove();
                    }
                }
                
                // Verifica se o inventário ficou vazio
                const categoriesContainer = document.querySelector('#inventory-categories');
                if (categoriesContainer && categoriesContainer.querySelectorAll('.item-card').length === 0) {
                    categoriesContainer.innerHTML = `
                        <div class="inventory-empty-state">
                            <div class="inventory-empty-icon">🎒</div>
                            <h3 class="inventory-empty-title">Inventário Vazio</h3>
                            <p class="inventory-empty-text">Adicione itens ao seu inventário.</p>
                        </div>
                    `;
                }
            }, 200);
        } else {
            const inventory = character.inventory.filter(item => item.id !== itemId);
            Store.setCharacterProperty('inventory', inventory);
        }
    },

    /**
     * Toggle equipar
     */
    toggleEquip(itemId) {
        const character = Store.get('character');
        if (!character) return;

        const item = character.inventory.find(i => i.id === itemId);
        if (item) {
            this.updateItem(itemId, { equipped: !item.equipped });
            this.refreshCard(itemId);
        }
    },

    /**
     * Adiciona item
     */
    addItem(item) {
        const character = Store.get('character');
        if (!character) return;

        item = this.initializeItemUses(item);
        const inventory = [...(character.inventory || []), item];
        Store.setCharacterProperty('inventory', inventory);

        const grid = document.querySelector('#inventory-grid');
        if (grid) {
            // Remove estado vazio
            const emptyState = grid.querySelector('.inventory-empty-state');
            if (emptyState) emptyState.remove();

            const card = this.renderCard(item, { editable: true, showDelete: true });
            card.classList.add('adding');
            grid.appendChild(card);
        }
    },

    /**
     * Abre modal de detalhes do item
     */
    openItemDetail(itemId) {
        const character = Store.get('character');
        if (!character) return;

        const item = character.inventory.find(i => i.id === itemId);
        if (!item) return;

        const itemType = this.detectItemType(item);
        const typeInfo = this.ITEM_TYPES[itemType];

        // Cria modal
        const modal = document.createElement('div');
        modal.className = 'modal-overlay item-detail-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button type="button" class="modal-close">✕</button>
                
                <div class="item-detail-header">
                    <span class="item-detail-icon">${typeInfo.icon}</span>
                    <div class="item-detail-info">
                        <h3>${this.escapeHtml(item.name)}</h3>
                        <span class="item-detail-type">${typeInfo.label}</span>
                    </div>
                </div>
                
                ${this.renderDetailTags(item) ? `
                    <div class="item-detail-section">
                        <h4>Rótulos</h4>
                        <div class="item-detail-tags">
                            ${this.renderDetailTags(item)}
                        </div>
                    </div>
                ` : ''}
                
                ${item.maxUses > 0 ? `
                    <div class="item-detail-section">
                        <h4>Usos (${item.currentUses || 0}/${item.maxUses})</h4>
                        <div class="item-detail-uses">
                            ${this.renderUseDots(item.maxUses, item.currentUses || 0, item.id)}
                        </div>
                    </div>
                ` : ''}
                
                ${item.description ? `
                    <div class="item-detail-section">
                        <h4>Descrição</h4>
                        <p class="item-detail-description">${this.escapeHtml(item.description)}</p>
                    </div>
                ` : ''}
                
                <div class="item-detail-actions">
                    ${(itemType === 'weapon' || itemType === 'armor') ? `
                        <button type="button" class="btn btn-secondary btn-detail-equip">
                            ${item.equipped ? '🛡️ Desequipar' : '○ Equipar'}
                        </button>
                    ` : ''}
                    ${!item.isStartingEquipment ? `
                        <button type="button" class="btn btn-ghost btn-detail-delete">
                            ✕ Remover
                        </button>
                    ` : `
                        <span class="starting-equipment-badge">📦 Equipamento Inicial</span>
                    `}
                </div>
            </div>
        `;

        // Função para fechar modal com animação
        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        };

        // Eventos do modal
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Equipar
        const equipBtn = modal.querySelector('.btn-detail-equip');
        equipBtn?.addEventListener('click', () => {
            this.toggleEquip(itemId);
            closeModal();
        });

        // Deletar
        const deleteBtn = modal.querySelector('.btn-detail-delete');
        deleteBtn?.addEventListener('click', () => {
            this.removeItem(itemId);
            closeModal();
        });

        // Bolinhas no modal
        modal.querySelectorAll('.use-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                this.toggleUse(itemId, parseInt(dot.dataset.dotIndex));
                // Atualiza modal
                const newItem = Store.get('character').inventory.find(i => i.id === itemId);
                if (newItem) {
                    const usesContainer = modal.querySelector('.item-detail-uses');
                    if (usesContainer) {
                        usesContainer.innerHTML = this.renderUseDots(newItem.maxUses, newItem.currentUses || 0, newItem.id);
                        // Re-attach events
                        usesContainer.querySelectorAll('.use-dot').forEach(d => {
                            d.addEventListener('click', () => {
                                this.toggleUse(itemId, parseInt(d.dataset.dotIndex));
                            });
                        });
                    }
                    // Atualiza título
                    const header = modal.querySelector('.item-detail-section h4');
                    if (header && header.textContent.includes('Usos')) {
                        header.textContent = `Usos (${newItem.currentUses || 0}/${newItem.maxUses})`;
                    }
                }
            });
        });

        document.body.appendChild(modal);
        
        // Adiciona classe active para exibir o modal
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });
    },

    /**
     * Renderiza bolinhas de uso como HTML string
     */
    renderUseDots(maxUses, currentUses, itemId) {
        let html = '';
        for (let i = 0; i < maxUses; i++) {
            const isAvailable = i < currentUses;
            html += `<div class="use-dot ${isAvailable ? 'available' : 'used'}" data-dot-index="${i}"></div>`;
        }
        return html;
    },

    /**
     * Renderiza todos os rótulos do item (incluindo peso, armadura, dano, etc.)
     */
    renderDetailTags(item) {
        const allTags = [];
        
        // Adiciona peso como rótulo
        if (item.weight > 0) {
            allTags.push({ text: `peso ${item.weight}`, type: 'stat' });
        }
        
        // Adiciona armadura como rótulo
        if (item.armor > 0) {
            allTags.push({ text: `armadura ${item.armor}`, type: 'stat-armor' });
        }
        
        // Adiciona quantidade como rótulo
        if (item.quantity > 1) {
            allTags.push({ text: `qtd ${item.quantity}`, type: 'stat' });
        }
        
        // Adiciona tags normais do item com classificação
        if (item.tags && item.tags.length > 0) {
            item.tags.forEach(tag => {
                const tagLower = tag.toLowerCase();
                
                // Evita duplicar informações de peso e armadura que já estão nas stats
                if (tagLower.startsWith('peso ') || tagLower.startsWith('armadura ')) {
                    return;
                }
                
                // Classifica o tipo da tag
                const tagType = this.classifyTag(tagLower);
                allTags.push({ text: tag, type: tagType });
            });
        }
        
        if (allTags.length === 0) return '';
        
        return allTags.map(tag => 
            `<span class="item-detail-tag tag-${tag.type}">${this.escapeHtml(tag.text)}</span>`
        ).join('');
    },

    /**
     * Classifica uma tag para aplicar estilo apropriado
     */
    classifyTag(tagLower) {
        // Tags de dano: +x dano, +x de dano, dano d6, etc.
        if (tagLower.match(/^\+\d+\s*(de\s*)?dano/) || tagLower.match(/dano\s*d\d+/) || tagLower.match(/^d\d+/)) {
            return 'stat-damage';
        }
        
        // Tags de penetração: penetrante x, x penetrante
        if (tagLower.includes('penetrante')) {
            return 'stat-piercing';
        }
        
        // Tags de combate corpo a corpo
        if (tagLower.includes('corpo a corpo') || tagLower === 'mão') {
            return 'stat-melee';
        }
        
        // Tags de alcance/distância
        if (['perto', 'próximo', 'longe', 'distante', 'alcance', 'arremesso'].some(t => tagLower.includes(t))) {
            return 'stat-range';
        }
        
        // Tags de munição
        if (tagLower.includes('munição')) {
            return 'stat-ammo';
        }
        
        // Tags de usos
        if (tagLower.match(/\d+\s*uso/)) {
            return 'stat-uses';
        }
        
        // Tags de precisão
        if (tagLower.includes('preciso') || tagLower.includes('precisa')) {
            return 'stat-precise';
        }
        
        // Tags de duas mãos
        if (tagLower.includes('duas mãos') || tagLower.includes('2 mãos')) {
            return 'stat-twohands';
        }
        
        // Tags de recarga
        if (tagLower.includes('recarga')) {
            return 'stat-reload';
        }
        
        // Tags de armadura (vestida, desengoçada, etc.)
        if (tagLower.includes('vestida') || tagLower.includes('desengoçada')) {
            return 'stat-armor-mod';
        }
        
        return 'normal';
    },

    /**
     * Escapa HTML
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Sobrescreve InventoryItem com o novo sistema
if (typeof window !== 'undefined') {
    window.InventoryCards = InventoryCards;
    window.InventoryItem = {
        render: (item, options) => InventoryCards.renderCard(item, options),
        renderInventory: (items, options) => InventoryCards.renderInventory(items, options),
        addItem: (item) => InventoryCards.addItem(item),
        updateItem: (itemId, updates) => InventoryCards.updateItem(itemId, updates),
        removeItem: (itemId) => InventoryCards.removeItem(itemId),
        toggleEquip: (itemId) => InventoryCards.toggleEquip(itemId),
        escapeHtml: (text) => InventoryCards.escapeHtml(text)
    };
}
