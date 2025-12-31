/**
 * =====================================================
 * DUNGEON WORLD - MODAIS INTERATIVOS
 * Sistema de modais para atributos e equipamentos
 * =====================================================
 */

const Modal = {
    /**
     * Cria e exibe um modal base
     * @param {Object} options - Configurações do modal
     * @returns {HTMLElement} - Elemento do modal
     */
    create(options) {
        const {
            id,
            title,
            titleIcon,
            content,
            onConfirm,
            onCancel,
            confirmText = 'Confirmar',
            cancelText = 'Cancelar',
            confirmDisabled = false
        } = options;

        // Remove modal existente se houver
        this.close(id);

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = `modal-${id}`;
        overlay.innerHTML = `
            <div class="modal-container">
                <div class="modal-header">
                    <h2 class="modal-title">
                        ${titleIcon ? `<span class="modal-title-icon">${titleIcon}</span>` : ''}
                        ${title}
                    </h2>
                    <button type="button" class="modal-close" aria-label="Fechar">✕</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    <button type="button" class="modal-btn modal-btn-secondary modal-cancel">
                        ${cancelText}
                    </button>
                    <button type="button" class="modal-btn modal-btn-primary modal-confirm" ${confirmDisabled ? 'disabled' : ''}>
                        ${confirmText}
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Eventos
        const closeBtn = overlay.querySelector('.modal-close');
        const cancelBtn = overlay.querySelector('.modal-cancel');
        const confirmBtn = overlay.querySelector('.modal-confirm');

        closeBtn.addEventListener('click', () => {
            if (onCancel) onCancel();
            this.close(id);
        });

        cancelBtn.addEventListener('click', () => {
            if (onCancel) onCancel();
            this.close(id);
        });

        confirmBtn.addEventListener('click', () => {
            if (onConfirm && !confirmBtn.disabled) {
                onConfirm();
            }
        });

        // Fechar ao clicar fora
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                if (onCancel) onCancel();
                this.close(id);
            }
        });

        // Fechar com ESC
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                if (onCancel) onCancel();
                this.close(id);
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        // Animar entrada
        requestAnimationFrame(() => {
            overlay.classList.add('active');
        });

        return overlay;
    },

    /**
     * Fecha um modal pelo ID
     * @param {string} id - ID do modal
     */
    close(id) {
        const overlay = document.getElementById(`modal-${id}`);
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 300);
        }
    },

    /**
     * Atualiza o estado do botão de confirmar
     * @param {string} id - ID do modal
     * @param {boolean} disabled - Se deve estar desabilitado
     */
    setConfirmDisabled(id, disabled) {
        const overlay = document.getElementById(`modal-${id}`);
        if (overlay) {
            const confirmBtn = overlay.querySelector('.modal-confirm');
            if (confirmBtn) {
                confirmBtn.disabled = disabled;
            }
        }
    }
};

/**
 * =====================================================
 * MODAL DE ATRIBUTOS - DRAG & DROP
 * ===================================================== */

const AttributesModal = {
    // Valores base do Dungeon World
    BASE_VALUES: [16, 15, 13, 12, 9, 8],
    
    // Nomes dos atributos
    ATTRIBUTES: [
        { id: 'for', name: 'FOR', fullName: 'Força' },
        { id: 'des', name: 'DES', fullName: 'Destreza' },
        { id: 'con', name: 'CON', fullName: 'Constituição' },
        { id: 'int', name: 'INT', fullName: 'Inteligência' },
        { id: 'sab', name: 'SAB', fullName: 'Sabedoria' },
        { id: 'car', name: 'CAR', fullName: 'Carisma' }
    ],

    // Estado atual das atribuições
    assignments: {},
    
    // Valor selecionado para mobile (toque)
    selectedValue: null,

    /**
     * Abre o modal de atributos
     */
    open() {
        const character = Store.get('character');
        
        // Inicializa assignments com valores atuais
        this.assignments = {};
        this.ATTRIBUTES.forEach(attr => {
            const value = character.attributes[attr.id];
            if (this.BASE_VALUES.includes(value)) {
                this.assignments[attr.id] = value;
            }
        });
        
        this.selectedValue = null;

        const content = this.generateContent();
        
        Modal.create({
            id: 'attributes',
            title: 'Definir Atributos',
            titleIcon: '🎲',
            content: content,
            confirmText: 'Confirmar Atributos',
            cancelText: 'Cancelar',
            confirmDisabled: !this.isComplete(),
            onConfirm: () => this.confirm()
        });

        this.attachEvents();
        this.updateDisplay();
    },

    /**
     * Gera o conteúdo HTML do modal
     */
    generateContent() {
        return `
            <p class="modal-description">
                Distribua os valores base entre seus atributos. Cada valor só pode ser usado uma vez.
                Arraste um valor para o atributo desejado, ou toque para selecionar e depois toque no destino.
            </p>
            
            <p class="touch-hint">
                📱 Toque em um valor para selecioná-lo, depois toque no atributo de destino.
            </p>
            
            <div class="attribute-values-pool">
                <div class="attribute-values-pool-title">Valores Disponíveis</div>
                <div class="attribute-values-container">
                    ${this.BASE_VALUES.map(value => `
                        <div class="attribute-value-chip ${this.isValueAssigned(value) ? 'assigned' : ''}" 
                             data-value="${value}" 
                             draggable="true">
                            ${value}
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="attributes-target-grid">
                ${this.ATTRIBUTES.map(attr => {
                    const value = this.assignments[attr.id];
                    const modifier = value ? Helpers.calculateModifier(value) : null;
                    return `
                        <div class="attribute-target-slot ${value ? 'filled' : ''}" data-attr="${attr.id}">
                            <span class="attribute-target-name">${attr.name}</span>
                            <span class="attribute-target-full-name">${attr.fullName}</span>
                            <div class="attribute-target-value-container">
                                ${value ? `
                                    <span class="attribute-target-value">${value}</span>
                                    <button type="button" class="attribute-remove-btn" data-attr="${attr.id}">✕</button>
                                ` : `
                                    <span class="attribute-target-empty">?</span>
                                `}
                            </div>
                            ${modifier !== null ? `
                                <span class="attribute-target-modifier ${modifier > 0 ? 'positive' : modifier < 0 ? 'negative' : 'neutral'}">
                                    ${modifier >= 0 ? '+' : ''}${modifier}
                                </span>
                            ` : `
                                <span class="attribute-target-modifier neutral">-</span>
                            `}
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div class="attributes-status ${this.isComplete() ? 'complete' : 'incomplete'}">
                ${this.isComplete() 
                    ? '✓ Todos os atributos foram definidos!' 
                    : `⚠ Faltam ${6 - Object.keys(this.assignments).length} atributo(s) para definir`}
            </div>
        `;
    },

    /**
     * Verifica se um valor já foi atribuído
     */
    isValueAssigned(value) {
        return Object.values(this.assignments).includes(value);
    },

    /**
     * Verifica se todos os atributos foram preenchidos
     */
    isComplete() {
        return Object.keys(this.assignments).length === 6;
    },

    /**
     * Anexa eventos de drag & drop e toque
     */
    attachEvents() {
        const overlay = document.getElementById('modal-attributes');
        if (!overlay) return;

        // Chips de valor
        overlay.querySelectorAll('.attribute-value-chip').forEach(chip => {
            // Drag events
            chip.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', chip.dataset.value);
                chip.classList.add('dragging');
            });

            chip.addEventListener('dragend', () => {
                chip.classList.remove('dragging');
            });

            // Touch/Click events para mobile
            chip.addEventListener('click', () => {
                if (chip.classList.contains('assigned')) return;
                
                // Toggle seleção
                if (this.selectedValue === parseInt(chip.dataset.value)) {
                    this.selectedValue = null;
                    chip.classList.remove('selected-for-assign');
                } else {
                    // Remove seleção anterior
                    overlay.querySelectorAll('.attribute-value-chip').forEach(c => {
                        c.classList.remove('selected-for-assign');
                    });
                    this.selectedValue = parseInt(chip.dataset.value);
                    chip.classList.add('selected-for-assign');
                }
            });
        });

        // Slots de atributo
        overlay.querySelectorAll('.attribute-target-slot').forEach(slot => {
            // Drag events
            slot.addEventListener('dragover', (e) => {
                e.preventDefault();
                slot.classList.add('drag-over');
            });

            slot.addEventListener('dragleave', () => {
                slot.classList.remove('drag-over');
            });

            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                slot.classList.remove('drag-over');
                
                const value = parseInt(e.dataTransfer.getData('text/plain'));
                const attr = slot.dataset.attr;
                
                this.assignValue(attr, value);
            });

            // Touch/Click events para mobile
            slot.addEventListener('click', (e) => {
                // Se clicar no botão de remover, não faz nada aqui
                if (e.target.classList.contains('attribute-remove-btn')) return;
                
                const attr = slot.dataset.attr;
                
                // Se tem um valor selecionado, atribui
                if (this.selectedValue !== null) {
                    this.assignValue(attr, this.selectedValue);
                    this.selectedValue = null;
                }
            });
        });

        // Botões de remover
        overlay.querySelectorAll('.attribute-remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const attr = btn.dataset.attr;
                this.removeAssignment(attr);
            });
        });
    },

    /**
     * Atribui um valor a um atributo
     */
    assignValue(attr, value) {
        // Se o valor já está em outro lugar, remove primeiro
        for (const [key, val] of Object.entries(this.assignments)) {
            if (val === value && key !== attr) {
                delete this.assignments[key];
            }
        }
        
        // Atribui o novo valor
        this.assignments[attr] = value;
        
        this.updateDisplay();
    },

    /**
     * Remove uma atribuição
     */
    removeAssignment(attr) {
        delete this.assignments[attr];
        this.updateDisplay();
    },

    /**
     * Atualiza o display do modal
     */
    updateDisplay() {
        const overlay = document.getElementById('modal-attributes');
        if (!overlay) return;

        // Atualiza chips
        overlay.querySelectorAll('.attribute-value-chip').forEach(chip => {
            const value = parseInt(chip.dataset.value);
            chip.classList.toggle('assigned', this.isValueAssigned(value));
            chip.classList.remove('selected-for-assign');
        });
        this.selectedValue = null;

        // Atualiza slots
        this.ATTRIBUTES.forEach(attr => {
            const slot = overlay.querySelector(`.attribute-target-slot[data-attr="${attr.id}"]`);
            if (!slot) return;

            const value = this.assignments[attr.id];
            const modifier = value ? Helpers.calculateModifier(value) : null;

            slot.classList.toggle('filled', !!value);
            
            const container = slot.querySelector('.attribute-target-value-container');
            container.innerHTML = value ? `
                <span class="attribute-target-value">${value}</span>
                <button type="button" class="attribute-remove-btn" data-attr="${attr.id}">✕</button>
            ` : `
                <span class="attribute-target-empty">?</span>
            `;

            const modSpan = slot.querySelector('.attribute-target-modifier');
            if (modSpan) {
                modSpan.className = `attribute-target-modifier ${modifier > 0 ? 'positive' : modifier < 0 ? 'negative' : 'neutral'}`;
                modSpan.textContent = modifier !== null ? `${modifier >= 0 ? '+' : ''}${modifier}` : '-';
            }
        });

        // Re-attach remove button events
        overlay.querySelectorAll('.attribute-remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const attr = btn.dataset.attr;
                this.removeAssignment(attr);
            });
        });

        // Atualiza status
        const status = overlay.querySelector('.attributes-status');
        if (status) {
            status.className = `attributes-status ${this.isComplete() ? 'complete' : 'incomplete'}`;
            status.innerHTML = this.isComplete() 
                ? '✓ Todos os atributos foram definidos!' 
                : `⚠ Faltam ${6 - Object.keys(this.assignments).length} atributo(s) para definir`;
        }

        // Atualiza botão de confirmar
        Modal.setConfirmDisabled('attributes', !this.isComplete());
    },

    /**
     * Confirma as atribuições
     */
    confirm() {
        if (!this.isComplete()) return;

        // Salva os atributos
        const character = Store.get('character');
        const classData = getClassById(character.classId);
        
        this.ATTRIBUTES.forEach(attr => {
            Store.setCharacterProperty(`attributes.${attr.id}`, this.assignments[attr.id]);
        });

        // Atualiza HP para o máximo após distribuir atributos
        const newMaxHP = Helpers.calculateMaxHP(classData.baseHP, this.assignments.con);
        Store.setCharacterProperty('currentHP', newMaxHP);

        // Marca que os atributos foram definidos
        Store.setCharacterProperty('attributesSet', true);

        Modal.close('attributes');
        
        // Re-renderiza a seção de dados
        if (typeof CharacterSheetPage !== 'undefined') {
            CharacterSheetPage.renderSection('dados');
        }
    }
};

/**
 * =====================================================
 * MODAL DE EQUIPAMENTOS INICIAIS
 * ===================================================== */

const EquipmentModal = {
    // Estado atual das escolhas
    choices: {},

    /**
     * Abre o modal de equipamentos
     */
    open() {
        const character = Store.get('character');
        const classData = getClassById(character.classId);
        
        if (!classData.startingEquipment) {
            alert('Esta classe não possui equipamento inicial definido.');
            return;
        }

        // Inicializa com escolhas existentes
        this.choices = { ...(character.equipmentChoices || {}) };
        
        const content = this.generateContent(classData);
        
        Modal.create({
            id: 'equipment',
            title: 'Equipamento Inicial',
            titleIcon: '🎒',
            content: content,
            confirmText: 'Confirmar Equipamentos',
            cancelText: 'Cancelar',
            confirmDisabled: !this.isComplete(classData),
            onConfirm: () => this.confirm(classData)
        });

        this.attachEvents(classData);
        this.updateSummary(classData);
    },

    /**
     * Gera o conteúdo HTML do modal
     */
    generateContent(classData) {
        const equipment = classData.startingEquipment;
        
        return `
            <p class="modal-description">
                Escolha seu equipamento inicial. Itens fixos são recebidos automaticamente.
                Para os grupos de escolha, selecione a opção desejada.
            </p>
            
            <!-- Itens Fixos -->
            ${equipment.fixed && equipment.fixed.length > 0 ? `
                <div class="equipment-modal-section">
                    <div class="equipment-section-header">
                        <span class="equipment-section-icon">📦</span>
                        <span class="equipment-section-title">Você Recebe Automaticamente</span>
                    </div>
                    <div class="fixed-items-list">
                        ${equipment.fixed.map(item => `
                            <div class="fixed-item">
                                <span class="fixed-item-check">✓</span>
                                <div class="fixed-item-info">
                                    <span class="fixed-item-name">${item.name}</span>
                                    ${item.tags && item.tags.length > 0 ? `
                                        <span class="fixed-item-tags">${item.tags.join(', ')}</span>
                                    ` : ''}
                                </div>
                                <span class="fixed-item-badge">Fixo</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <!-- Escolhas -->
            ${equipment.choices && equipment.choices.length > 0 ? `
                <div class="equipment-modal-section">
                    <div class="equipment-section-header">
                        <span class="equipment-section-icon">⚔️</span>
                        <span class="equipment-section-title">Escolhas de Equipamento</span>
                    </div>
                    
                    ${equipment.choices.map(choice => {
                        const isMulti = choice.multiSelect;
                        const maxChoices = choice.maxChoices || 1;
                        const currentChoices = this.choices[choice.id];
                        const selectedCount = isMulti 
                            ? (Array.isArray(currentChoices) ? currentChoices.length : 0)
                            : (currentChoices ? 1 : 0);
                        const isComplete = isMulti ? selectedCount >= maxChoices : selectedCount > 0;
                        
                        return `
                            <div class="equipment-choice-modal-group ${isComplete ? 'completed' : ''}" 
                                 data-choice-id="${choice.id}" 
                                 data-multi="${isMulti}" 
                                 data-max="${maxChoices}">
                                <div class="choice-group-header">
                                    <span class="choice-group-title">${choice.title}</span>
                                    <span class="choice-group-status ${isComplete ? 'complete' : 'pending'}">
                                        ${isMulti 
                                            ? `${selectedCount}/${maxChoices}` 
                                            : (isComplete ? '✓' : 'Pendente')}
                                    </span>
                                </div>
                                <div class="choice-options-grid">
                                    ${choice.options.map(option => {
                                        const isSelected = isMulti
                                            ? (Array.isArray(currentChoices) && currentChoices.includes(option.id))
                                            : currentChoices === option.id;
                                        
                                        return `
                                            <div class="choice-option-card ${isSelected ? 'selected' : ''}" 
                                                 data-option-id="${option.id}">
                                                <div class="${isMulti ? 'choice-option-checkbox' : 'choice-option-radio'}"></div>
                                                <div class="choice-option-content">
                                                    <div class="choice-option-items">
                                                        ${option.items.map(item => `
                                                            <div class="choice-option-item">
                                                                <span class="choice-option-item-name">${item.name}</span>
                                                                ${item.tags && item.tags.length > 0 ? `
                                                                    <span class="choice-option-item-tags">${item.tags.join(', ')}</span>
                                                                ` : ''}
                                                            </div>
                                                        `).join('')}
                                                    </div>
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            ` : ''}
            
            <!-- Resumo -->
            <div class="equipment-summary">
                <div class="equipment-summary-title">Resumo do Equipamento</div>
                <div class="equipment-summary-stats">
                    <div class="summary-stat">
                        <span class="summary-stat-value" id="summary-total-items">0</span>
                        <span class="summary-stat-label">Itens</span>
                    </div>
                    <div class="summary-stat">
                        <span class="summary-stat-value" id="summary-total-weight">0</span>
                        <span class="summary-stat-label">Peso Total</span>
                    </div>
                    <div class="summary-stat">
                        <span class="summary-stat-value" id="summary-total-armor">0</span>
                        <span class="summary-stat-label">Armadura</span>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Verifica se todas as escolhas obrigatórias foram feitas
     */
    isComplete(classData) {
        const equipment = classData.startingEquipment;
        if (!equipment.choices) return true;
        
        for (const choice of equipment.choices) {
            const current = this.choices[choice.id];
            
            if (choice.multiSelect) {
                const maxChoices = choice.maxChoices || 1;
                if (!Array.isArray(current) || current.length < maxChoices) {
                    return false;
                }
            } else {
                if (!current) {
                    return false;
                }
            }
        }
        
        return true;
    },

    /**
     * Anexa eventos aos cards de escolha
     */
    attachEvents(classData) {
        const overlay = document.getElementById('modal-equipment');
        if (!overlay) return;

        overlay.querySelectorAll('.choice-option-card').forEach(card => {
            card.addEventListener('click', () => {
                const group = card.closest('.equipment-choice-modal-group');
                const choiceId = group.dataset.choiceId;
                const isMulti = group.dataset.multi === 'true';
                const maxChoices = parseInt(group.dataset.max);
                const optionId = card.dataset.optionId;

                if (isMulti) {
                    // Multi-select (checkbox)
                    let current = this.choices[choiceId] || [];
                    if (!Array.isArray(current)) current = [];

                    if (card.classList.contains('selected')) {
                        // Desseleciona
                        current = current.filter(id => id !== optionId);
                    } else if (current.length < maxChoices) {
                        // Seleciona (se não atingiu o limite)
                        current.push(optionId);
                    }
                    
                    this.choices[choiceId] = current;
                } else {
                    // Single-select (radio)
                    this.choices[choiceId] = optionId;
                }

                this.updateDisplay(classData);
            });
        });
    },

    /**
     * Atualiza o display visual
     */
    updateDisplay(classData) {
        const overlay = document.getElementById('modal-equipment');
        if (!overlay) return;

        // Atualiza grupos de escolha
        overlay.querySelectorAll('.equipment-choice-modal-group').forEach(group => {
            const choiceId = group.dataset.choiceId;
            const isMulti = group.dataset.multi === 'true';
            const maxChoices = parseInt(group.dataset.max);
            const current = this.choices[choiceId];
            
            const selectedCount = isMulti 
                ? (Array.isArray(current) ? current.length : 0)
                : (current ? 1 : 0);
            const isComplete = isMulti ? selectedCount >= maxChoices : selectedCount > 0;
            
            group.classList.toggle('completed', isComplete);
            
            const status = group.querySelector('.choice-group-status');
            if (status) {
                status.className = `choice-group-status ${isComplete ? 'complete' : 'pending'}`;
                status.textContent = isMulti 
                    ? `${selectedCount}/${maxChoices}` 
                    : (isComplete ? '✓' : 'Pendente');
            }

            // Atualiza cards
            group.querySelectorAll('.choice-option-card').forEach(card => {
                const optionId = card.dataset.optionId;
                const isSelected = isMulti
                    ? (Array.isArray(current) && current.includes(optionId))
                    : current === optionId;
                
                card.classList.toggle('selected', isSelected);
                
                // Desabilita se atingiu limite e não está selecionado
                const disabled = isMulti && !isSelected && selectedCount >= maxChoices;
                card.classList.toggle('disabled', disabled);
            });
        });

        // Atualiza resumo
        this.updateSummary(classData);

        // Atualiza botão de confirmar
        Modal.setConfirmDisabled('equipment', !this.isComplete(classData));
    },

    /**
     * Atualiza o resumo do equipamento
     */
    updateSummary(classData) {
        const equipment = classData.startingEquipment;
        let totalItems = 0;
        let totalWeight = 0;
        let totalArmor = 0;

        // Itens fixos
        if (equipment.fixed) {
            equipment.fixed.forEach(item => {
                totalItems++;
                totalWeight += item.weight || 0;
                totalArmor += item.armor || 0;
            });
        }

        // Itens escolhidos
        if (equipment.choices) {
            equipment.choices.forEach(choice => {
                const selected = this.choices[choice.id];
                if (!selected) return;
                
                const selectedIds = Array.isArray(selected) ? selected : [selected];
                
                selectedIds.forEach(optionId => {
                    const option = choice.options.find(o => o.id === optionId);
                    if (option && option.items) {
                        option.items.forEach(item => {
                            totalItems++;
                            totalWeight += item.weight || 0;
                            totalArmor += item.armor || 0;
                        });
                    }
                });
            });
        }

        // Atualiza display
        const overlay = document.getElementById('modal-equipment');
        if (overlay) {
            const itemsEl = overlay.querySelector('#summary-total-items');
            const weightEl = overlay.querySelector('#summary-total-weight');
            const armorEl = overlay.querySelector('#summary-total-armor');
            
            if (itemsEl) itemsEl.textContent = totalItems;
            if (weightEl) weightEl.textContent = totalWeight;
            if (armorEl) armorEl.textContent = totalArmor;
        }
    },

    /**
     * Confirma as escolhas de equipamento
     */
    confirm(classData) {
        if (!this.isComplete(classData)) return;

        const equipment = classData.startingEquipment;
        const inventory = [];

        // Adiciona itens fixos
        if (equipment.fixed) {
            equipment.fixed.forEach(item => {
                inventory.push({
                    id: Helpers.generateId(),
                    name: item.name,
                    weight: item.weight || 0,
                    tags: item.tags || [],
                    armor: item.armor || 0,
                    equipped: false,
                    isSignatureWeapon: item.isSignatureWeapon || false
                });
            });
        }

        // Adiciona itens escolhidos
        if (equipment.choices) {
            equipment.choices.forEach(choice => {
                const selected = this.choices[choice.id];
                if (!selected) return;
                
                const selectedIds = Array.isArray(selected) ? selected : [selected];
                
                selectedIds.forEach(optionId => {
                    const option = choice.options.find(o => o.id === optionId);
                    if (option && option.items) {
                        option.items.forEach(item => {
                            // Verifica se é moedas
                            if (item.name.toLowerCase().includes('moeda')) {
                                const match = item.name.match(/(\d+)/);
                                if (match) {
                                    const coins = parseInt(match[1]);
                                    const character = Store.get('character');
                                    Store.setCharacterProperty('coins', (character.coins || 0) + coins);
                                }
                            } else {
                                inventory.push({
                                    id: Helpers.generateId(),
                                    name: item.name,
                                    weight: item.weight || 0,
                                    tags: item.tags || [],
                                    armor: item.armor || 0,
                                    equipped: false
                                });
                            }
                        });
                    }
                });
            });
        }

        // Salva no estado
        Store.setCharacterProperty('inventory', inventory);
        Store.setCharacterProperty('equipmentChoices', this.choices);
        Store.setCharacterProperty('equipmentChosen', true);

        Modal.close('equipment');

        // Re-renderiza a seção de inventário
        if (typeof CharacterSheetPage !== 'undefined') {
            CharacterSheetPage.renderSection('inventario');
        }
    }
};

/**
 * =====================================================
 * MODAL DE MULTICLASSE
 * Permite selecionar movimentos de outras classes
 * =====================================================
 */
const MulticlassModal = {
    selectedMove: null,
    sourceMovementId: null,
    
    /**
     * Abre o modal de seleção de movimento multiclasse
     * @param {string} sourceMovementId - ID do movimento que concede multiclasse
     * @param {Array<string>} availableClasses - IDs das classes disponíveis
     */
    open(sourceMovementId, availableClasses) {
        this.selectedMove = null;
        this.sourceMovementId = sourceMovementId;
        
        const character = Store.get('character');
        const acquiredMoves = character?.acquiredMoves || [];
        const multiclassMoves = character?.multiclassMoves || [];
        const characterLevel = character?.level || 1;
        
        // Nível máximo de movimento que pode pegar = nível atual - 1
        const maxMoveLevel = characterLevel - 1;
        
        // Coleta todos os movimentos das classes disponíveis
        const movesContent = this.buildMovesContent(availableClasses, acquiredMoves, multiclassMoves, maxMoveLevel);
        
        // Mensagem explicativa baseada no nível
        let levelExplanation = '';
        if (maxMoveLevel < 1) {
            levelExplanation = '<p class="text-warning"><strong>⚠️ Nível insuficiente:</strong> Você precisa ser pelo menos nível 2 para usar multiclasse.</p>';
        } else if (maxMoveLevel < 2) {
            levelExplanation = '<p class="text-muted"><small>📖 Seu nível permite apenas movimentos iniciais.</small></p>';
        } else if (maxMoveLevel < 6) {
            levelExplanation = '<p class="text-muted"><small>📖 Seu nível permite movimentos iniciais e avançados (2-5).</small></p>';
        } else {
            levelExplanation = '<p class="text-muted"><small>📖 Seu nível permite todos os movimentos.</small></p>';
        }
        
        const content = `
            <div class="multiclass-modal-intro">
                <p>Selecione um movimento de uma das classes disponíveis:</p>
                ${levelExplanation}
                <p class="text-muted"><small>Movimentos de multiclasse das outras classes não podem ser selecionados.</small></p>
            </div>
            <div class="multiclass-classes-tabs">
                ${availableClasses.map((classId, index) => {
                    const classData = getClassById(classId);
                    const displayData = CLASS_LIST.find(c => c.id === classId);
                    return `
                        <button type="button" 
                                class="multiclass-tab ${index === 0 ? 'active' : ''}" 
                                data-class="${classId}"
                                style="--class-color: ${displayData?.color || '#666'}">
                            <span class="tab-icon">${displayData?.icon || '⚔️'}</span>
                            <span class="tab-name">${classData?.name || classId}</span>
                        </button>
                    `;
                }).join('')}
            </div>
            <div class="multiclass-moves-container">
                ${movesContent}
            </div>
        `;
        
        Modal.create({
            id: 'multiclass',
            title: 'Selecionar Movimento',
            titleIcon: '📜',
            content: content,
            confirmText: 'Adquirir Movimento',
            cancelText: 'Cancelar',
            confirmDisabled: true,
            onConfirm: () => this.confirmSelection(),
            onCancel: () => this.cancelSelection()
        });
        
        this.attachEvents();
    },
    
    /**
     * Constrói o conteúdo HTML dos movimentos
     * @param {Array} availableClasses - Classes disponíveis
     * @param {Array} acquiredMoves - Movimentos já adquiridos
     * @param {Array} multiclassMoves - Movimentos de multiclasse já obtidos
     * @param {number} maxMoveLevel - Nível máximo de movimento permitido (nível do personagem - 1)
     */
    buildMovesContent(availableClasses, acquiredMoves, multiclassMoves, maxMoveLevel) {
        return availableClasses.map((classId, index) => {
            const classData = getClassById(classId);
            if (!classData) return '';
            
            // Monta lista de movimentos baseada no nível permitido
            // Nível 1: startingMoves
            // Nível 2-5: startingMoves + advancedMoves2_5
            // Nível 6+: startingMoves + advancedMoves2_5 + advancedMoves6_10
            let availableMoves = [];
            
            if (maxMoveLevel >= 1) {
                // Adiciona movimentos iniciais (considerados nível 1)
                const startingMoves = (classData.startingMoves || []).map(m => ({...m, moveLevel: 1, levelCategory: 'Inicial'}));
                availableMoves.push(...startingMoves);
            }
            
            if (maxMoveLevel >= 2) {
                // Adiciona movimentos avançados 2-5
                const advMoves2_5 = (classData.advancedMoves2_5 || []).map(m => ({...m, moveLevel: 2, levelCategory: 'Avançado (2-5)'}));
                availableMoves.push(...advMoves2_5);
            }
            
            if (maxMoveLevel >= 6) {
                // Adiciona movimentos avançados 6-10
                const advMoves6_10 = (classData.advancedMoves6_10 || []).map(m => ({...m, moveLevel: 6, levelCategory: 'Avançado (6-10)'}));
                availableMoves.push(...advMoves6_10);
            }
            
            // Filtra movimentos
            const filteredMoves = availableMoves.filter(move => {
                // Remove movimentos de multiclasse (não pode pegar multiclasse de multiclasse)
                if (move.allowsMulticlass) return false;
                // Remove movimentos já adquiridos pela própria classe
                if (acquiredMoves.includes(move.id)) return false;
                // Remove movimentos já obtidos via multiclasse
                if (multiclassMoves.some(m => m.moveId === move.id)) return false;
                // Remove movimentos de escolha de raça/background/estilo (não são "movimentos" propriamente)
                if (move.type === 'racial' || move.type === 'choice' || move.type === 'background') return false;
                // Remove movimentos que são apenas configurações (como "Escolha Inicial de Estilo")
                if (move.combatStyleOptions || move.landOptions || move.preceptOptions) return false;
                return true;
            });
            
            const displayData = CLASS_LIST.find(c => c.id === classId);
            
            return `
                <div class="multiclass-class-moves ${index === 0 ? 'active' : ''}" data-class="${classId}">
                    <div class="multiclass-moves-grid">
                        ${filteredMoves.length > 0 ? filteredMoves.map(move => this.renderMoveCard(move, classId, displayData)).join('') : `
                            <p class="text-muted text-center">Nenhum movimento disponível nesta classe para seu nível.</p>
                        `}
                    </div>
                </div>
            `;
        }).join('');
    },
    
    /**
     * Renderiza um card de movimento para seleção
     */
    renderMoveCard(move, classId, displayData) {
        const formattedDescription = move.description ? Helpers.formatMovementText(move.description) : '';
        
        // Renderiza lista de opções se existir
        let optionsHtml = '';
        if (move.options && move.options.length > 0) {
            optionsHtml = `
                <div class="multiclass-move-options">
                    <ul class="move-options-list">
                        ${move.options.map(opt => `<li>${opt}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        // Renderiza opções de conhecimento de bardo
        if (move.loreOptions && move.loreOptions.length > 0) {
            optionsHtml = `
                <div class="multiclass-move-options">
                    <span class="options-label">Áreas de conhecimento:</span>
                    <ul class="move-options-list">
                        ${move.loreOptions.map(opt => `<li>${opt}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        return `
            <div class="multiclass-move-card" 
                 data-move-id="${move.id}" 
                 data-class-id="${classId}"
                 data-move-level="${move.moveLevel || 1}"
                 style="--class-color: ${displayData?.color || '#666'}">
                <div class="multiclass-move-header">
                    <h4 class="multiclass-move-name">${move.name}</h4>
                    <div class="multiclass-move-badges">
                        ${move.levelCategory ? `<span class="multiclass-move-level">${move.levelCategory}</span>` : ''}
                        ${move.attribute ? `<span class="multiclass-move-attr">+${move.attribute.toUpperCase()}</span>` : ''}
                    </div>
                </div>
                ${move.trigger ? `<p class="multiclass-move-trigger">${move.trigger}</p>` : ''}
                <div class="multiclass-move-description">${formattedDescription}</div>
                ${optionsHtml}
                ${move.results ? `
                    <div class="multiclass-move-results">
                        ${move.results.success ? `<div class="result result-success"><strong>10+:</strong> ${move.results.success}</div>` : ''}
                        ${move.results.partial ? `<div class="result result-partial"><strong>7-9:</strong> ${move.results.partial}</div>` : ''}
                        ${move.results.fail ? `<div class="result result-fail"><strong>6-:</strong> ${move.results.fail}</div>` : ''}
                    </div>
                ` : ''}
            </div>
        `;
    },
    

    
    /**
     * Anexa eventos ao modal
     */
    attachEvents() {
        const modal = document.getElementById('modal-multiclass');
        if (!modal) return;
        
        // Tabs de classes
        const tabs = modal.querySelectorAll('.multiclass-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const classId = tab.dataset.class;
                
                // Atualiza tabs
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Atualiza conteúdo
                const contents = modal.querySelectorAll('.multiclass-class-moves');
                contents.forEach(c => {
                    c.classList.toggle('active', c.dataset.class === classId);
                });
            });
        });
        
        // Seleção de movimentos
        const moveCards = modal.querySelectorAll('.multiclass-move-card');
        moveCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove seleção anterior
                moveCards.forEach(c => c.classList.remove('selected'));
                // Seleciona este
                card.classList.add('selected');
                
                this.selectedMove = {
                    moveId: card.dataset.moveId,
                    fromClass: card.dataset.classId
                };
                
                // Habilita botão de confirmar
                const confirmBtn = modal.querySelector('.modal-confirm');
                if (confirmBtn) confirmBtn.disabled = false;
            });
        });
    },
    
    /**
     * Confirma a seleção do movimento
     */
    confirmSelection() {
        if (!this.selectedMove) return;
        
        const character = Store.get('character');
        if (!character) return;
        
        // Obtém dados do movimento selecionado
        const sourceClass = getClassById(this.selectedMove.fromClass);
        const allMoves = [
            ...(sourceClass?.startingMoves || []),
            ...(sourceClass?.advancedMoves2_5 || []),
            ...(sourceClass?.advancedMoves6_10 || [])
        ];
        const moveData = allMoves.find(m => m.id === this.selectedMove.moveId);
        
        if (!moveData) return;
        
        // Adiciona aos movimentos de multiclasse
        const multiclassMoves = [...(character.multiclassMoves || [])];
        multiclassMoves.push({
            moveId: this.selectedMove.moveId,
            fromClass: this.selectedMove.fromClass,
            grantedBy: this.sourceMovementId,
            name: moveData.name,
            description: moveData.description,
            trigger: moveData.trigger || null,
            attribute: moveData.attribute || null,
            results: moveData.results || null
        });
        
        Store.setCharacterProperty('multiclassMoves', multiclassMoves);
        
        Modal.close('multiclass');
        
        // Atualiza a seção de movimentos
        if (typeof CharacterSheetPage !== 'undefined') {
            CharacterSheetPage.renderSection('movimentos');
        }
        
        // Notificação
        this.showNotification(`Movimento "${moveData.name}" adquirido!`, 'success');
    },
    
    /**
     * Cancela a seleção (remove o movimento de multiclasse que foi marcado)
     */
    cancelSelection() {
        // Se o usuário cancelar, remove o movimento que concede multiclasse
        if (this.sourceMovementId) {
            MovementCard.handleToggleMove(this.sourceMovementId, false);
        }
    },
    
    /**
     * Mostra notificação
     */
    showNotification(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.setAttribute('role', 'alert');
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('toast-visible'), 10);
        setTimeout(() => {
            toast.classList.remove('toast-visible');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

/**
 * =====================================================
 * MODAL DE GRIMÓRIO EXPANDIDO
 * Permite selecionar feitiços de outras classes
 * =====================================================
 */
const ExpandedSpellModal = {
    selectedSpell: null,
    sourceMovementId: null,
    
    /**
     * Abre o modal de seleção de feitiço expandido
     * @param {string} sourceMovementId - ID do movimento que concede o feitiço
     * @param {string} spellSource - Fonte dos feitiços ('clerigo')
     */
    open(sourceMovementId, spellSource) {
        this.selectedSpell = null;
        this.sourceMovementId = sourceMovementId;
        
        const character = Store.get('character');
        const characterLevel = character?.level || 1;
        const expandedSpells = character?.expandedSpells || [];
        
        // Nível máximo de feitiço que pode pegar = nível atual - 1
        const maxSpellLevel = characterLevel - 1;
        
        if (maxSpellLevel < 1) {
            Modal.create({
                id: 'expanded-spell',
                title: 'Grimório Expandido',
                titleIcon: '📖',
                content: '<p class="text-warning">⚠️ Você precisa ser pelo menos nível 2 para usar este movimento.</p>',
                confirmText: 'OK',
                onConfirm: () => {
                    Modal.close('expanded-spell');
                    // Remove o movimento
                    MovementCard.handleToggleMove(sourceMovementId, false);
                }
            });
            return;
        }
        
        // Obtém feitiços do clérigo
        const spells = this.getAvailableSpells(spellSource, maxSpellLevel, expandedSpells);
        const spellsContent = this.buildSpellsContent(spells, maxSpellLevel);
        
        const content = `
            <div class="expanded-spell-modal-intro">
                <p>Selecione um feitiço do clérigo para adicionar ao seu grimório:</p>
                <p class="text-muted"><small>📖 Seu nível (${characterLevel}) permite feitiços de até nível ${maxSpellLevel}.</small></p>
            </div>
            <div class="expanded-spell-container">
                ${spellsContent}
            </div>
        `;
        
        Modal.create({
            id: 'expanded-spell',
            title: 'Grimório Expandido',
            titleIcon: '📖',
            content: content,
            confirmText: 'Adicionar ao Grimório',
            cancelText: 'Cancelar',
            confirmDisabled: true,
            onConfirm: () => this.confirmSelection(),
            onCancel: () => this.cancelSelection()
        });
        
        this.attachEvents();
    },
    
    /**
     * Obtém feitiços disponíveis
     */
    getAvailableSpells(source, maxLevel, alreadyAcquired) {
        let spells = [];
        
        if (source === 'clerigo' && typeof CLERIGO_SPELLS !== 'undefined') {
            // Adiciona orações (nível 0, sempre disponíveis)
            if (CLERIGO_SPELLS.oracoes) {
                spells.push(...CLERIGO_SPELLS.oracoes.map(s => ({...s, levelCategory: 'Orações'})));
            }
            
            // Adiciona feitiços por nível
            if (maxLevel >= 1 && CLERIGO_SPELLS.nivel1) {
                spells.push(...CLERIGO_SPELLS.nivel1.map(s => ({...s, levelCategory: 'Nível 1'})));
            }
            if (maxLevel >= 3 && CLERIGO_SPELLS.nivel3) {
                spells.push(...CLERIGO_SPELLS.nivel3.map(s => ({...s, levelCategory: 'Nível 3'})));
            }
            if (maxLevel >= 5 && CLERIGO_SPELLS.nivel5) {
                spells.push(...CLERIGO_SPELLS.nivel5.map(s => ({...s, levelCategory: 'Nível 5'})));
            }
            if (maxLevel >= 7 && CLERIGO_SPELLS.nivel7) {
                spells.push(...CLERIGO_SPELLS.nivel7.map(s => ({...s, levelCategory: 'Nível 7'})));
            }
            if (maxLevel >= 9 && CLERIGO_SPELLS.nivel9) {
                spells.push(...CLERIGO_SPELLS.nivel9.map(s => ({...s, levelCategory: 'Nível 9'})));
            }
        }
        
        // Filtra feitiços já adquiridos via grimório expandido
        const acquiredIds = alreadyAcquired.map(s => s.spellId);
        return spells.filter(s => !acquiredIds.includes(s.id));
    },
    
    /**
     * Constrói conteúdo HTML dos feitiços
     */
    buildSpellsContent(spells, maxLevel) {
        if (spells.length === 0) {
            return '<p class="text-muted text-center">Nenhum feitiço disponível.</p>';
        }
        
        // Agrupa por categoria de nível
        const groups = {};
        spells.forEach(spell => {
            const cat = spell.levelCategory || 'Outros';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(spell);
        });
        
        let html = '';
        for (const [category, categorySpells] of Object.entries(groups)) {
            html += `
                <div class="expanded-spell-group">
                    <h4 class="expanded-spell-group-title">${category}</h4>
                    <div class="expanded-spell-grid">
                        ${categorySpells.map(spell => this.renderSpellCard(spell)).join('')}
                    </div>
                </div>
            `;
        }
        
        return html;
    },
    
    /**
     * Renderiza card de feitiço
     */
    renderSpellCard(spell) {
        return `
            <div class="expanded-spell-card" data-spell-id="${spell.id}" data-spell-level="${spell.level}">
                <div class="expanded-spell-header">
                    <h4 class="expanded-spell-name">${spell.name}</h4>
                    <span class="expanded-spell-level">Nv. ${spell.level}</span>
                </div>
                <p class="expanded-spell-description">${this.truncateText(spell.description, 150)}</p>
                ${spell.ongoing ? '<span class="expanded-spell-tag">Contínuo</span>' : ''}
            </div>
        `;
    },
    
    /**
     * Trunca texto
     */
    truncateText(text, maxLength) {
        if (!text || text.length <= maxLength) return text || '';
        return text.substring(0, maxLength) + '...';
    },
    
    /**
     * Anexa eventos
     */
    attachEvents() {
        const modal = document.getElementById('modal-expanded-spell');
        if (!modal) return;
        
        const spellCards = modal.querySelectorAll('.expanded-spell-card');
        spellCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove seleção anterior
                spellCards.forEach(c => c.classList.remove('selected'));
                // Seleciona este
                card.classList.add('selected');
                
                this.selectedSpell = {
                    spellId: card.dataset.spellId,
                    level: parseInt(card.dataset.spellLevel)
                };
                
                // Habilita botão de confirmar
                const confirmBtn = modal.querySelector('.modal-confirm');
                if (confirmBtn) {
                    confirmBtn.disabled = false;
                    confirmBtn.classList.remove('btn-disabled');
                }
            });
        });
    },
    
    /**
     * Confirma seleção
     */
    confirmSelection() {
        if (!this.selectedSpell) return;
        
        const character = Store.get('character');
        if (!character) return;
        
        // Busca dados do feitiço
        let spellData = null;
        if (typeof CLERIGO_SPELLS !== 'undefined') {
            const allSpells = [
                ...(CLERIGO_SPELLS.oracoes || []),
                ...(CLERIGO_SPELLS.nivel1 || []),
                ...(CLERIGO_SPELLS.nivel3 || []),
                ...(CLERIGO_SPELLS.nivel5 || []),
                ...(CLERIGO_SPELLS.nivel7 || []),
                ...(CLERIGO_SPELLS.nivel9 || [])
            ];
            spellData = allSpells.find(s => s.id === this.selectedSpell.spellId);
        }
        
        if (!spellData) return;
        
        // Adiciona aos feitiços expandidos
        const expandedSpells = [...(character.expandedSpells || [])];
        expandedSpells.push({
            spellId: this.selectedSpell.spellId,
            fromClass: 'clerigo',
            grantedBy: this.sourceMovementId,
            name: spellData.name,
            level: spellData.level,
            description: spellData.description,
            ongoing: spellData.ongoing || false
        });
        
        Store.setCharacterProperty('expandedSpells', expandedSpells);
        
        Modal.close('expanded-spell');
        
        // Atualiza a seção de movimentos
        if (typeof CharacterSheetPage !== 'undefined') {
            CharacterSheetPage.renderSection('movimentos');
        }
        
        // Notificação
        this.showNotification(`Feitiço "${spellData.name}" adicionado ao grimório!`, 'success');
    },
    
    /**
     * Cancela seleção
     */
    cancelSelection() {
        if (this.sourceMovementId) {
            MovementCard.handleToggleMove(this.sourceMovementId, false);
        }
    },
    
    /**
     * Mostra notificação
     */
    showNotification(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.setAttribute('role', 'alert');
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('toast-visible'), 10);
        setTimeout(() => {
            toast.classList.remove('toast-visible');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

// Exporta para uso global
if (typeof window !== 'undefined') {
    window.Modal = Modal;
    window.AttributesModal = AttributesModal;
    window.EquipmentModal = EquipmentModal;
    window.MulticlassModal = MulticlassModal;
    window.ExpandedSpellModal = ExpandedSpellModal;
}
