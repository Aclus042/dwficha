/**
 * =====================================================
 * DUNGEON WORLD - PÁGINA: FICHA DE PERSONAGEM
 * Página principal com todas as seções da ficha
 * =====================================================
 */

const CharacterSheetPage = {
    /**
     * Inicializa a página da ficha de personagem
     */
    init() {
        this.container = document.getElementById('app');
        this.currentSection = Store.get('currentSection') || 'personagem';
        
        this.render();
        this.attachEvents();
        this.subscribeToChanges();
    },

    /**
     * Renderiza a página completa
     */
    render() {
        const character = Store.get('character');
        if (!character) {
            Store.navigateTo('class-selection');
            return;
        }

        // Obtém o template
        const template = document.getElementById('template-character-sheet');
        if (!template) {
            console.error('Template de ficha não encontrado');
            return;
        }

        // Clona e insere o template
        const content = template.content.cloneNode(true);
        this.container.innerHTML = '';
        this.container.appendChild(content);

        // Renderiza cabeçalho
        this.renderHeader();

        // Renderiza navegação
        this.renderNavigation();

        // Renderiza seção atual
        this.renderSection(this.currentSection);
    },

    /**
     * Renderiza o cabeçalho da ficha
     */
    renderHeader() {
        const character = Store.get('character');
        const classData = getClassById(character.classId);
        const displayData = CLASS_LIST.find(c => c.id === character.classId);

        const header = document.querySelector('.sheet-header');
        if (!header) return;

        header.innerHTML = `
            <div class="sheet-header-main">
                <div class="sheet-class-badge" style="--class-color: ${displayData?.color || 'var(--color-flame)'}">
                    <span class="class-icon">${displayData?.icon || '⚔️'}</span>
                </div>
                
                <div class="sheet-header-info">
                    <input type="text" 
                           class="sheet-name-input" 
                           placeholder="Nome do Personagem"
                           value="${character.name || ''}"
                           aria-label="Nome do personagem">
                    
                    <div class="sheet-header-details">
                        <span class="sheet-class">${classData?.name || 'Classe'}</span>
                        <span class="sheet-level">Nível ${character.level}</span>
                        ${character.race ? `<span class="sheet-race">${character.race}</span>` : ''}
                    </div>
                </div>
            </div>
            
            <div class="sheet-header-actions">
                <button type="button" class="btn btn-help" title="Referência de Movimentos">
                    ?
                </button>
                <button type="button" class="btn btn-secondary btn-small export-character">
                    📥 Exportar
                </button>
                <button type="button" class="btn btn-ghost btn-small back-to-selection">
                    ← Voltar
                </button>
            </div>
        `;

        // Eventos do cabeçalho
        const nameInput = header.querySelector('.sheet-name-input');
        const helpBtn = header.querySelector('.btn-help');
        const exportBtn = header.querySelector('.export-character');
        const backBtn = header.querySelector('.back-to-selection');

        nameInput.addEventListener('change', () => {
            Store.setCharacterProperty('name', nameInput.value);
        });

        helpBtn.addEventListener('click', () => this.navigateToSection('referencia'));
        exportBtn.addEventListener('click', () => this.exportCharacter());
        backBtn.addEventListener('click', () => this.confirmBack());

        // Inicializa o sistema de avatar
        const badge = header.querySelector('.sheet-class-badge');
        if (badge && typeof CharacterAvatar !== 'undefined') {
            CharacterAvatar.init(badge);
        }
    },

    /**
     * Renderiza a navegação
     */
    renderNavigation() {
        const nav = document.querySelector('.sheet-nav');
        const navWrapper = document.querySelector('.sheet-nav-wrapper');
        if (!nav) return;
        
        const character = Store.get('character');

        // Seções base
        const sections = [
            { id: 'personagem', label: 'Personagem', icon: '👤' },
            { id: 'dados', label: 'Dados', icon: '🎲' },
            { id: 'inventario', label: 'Inventário', icon: '🎒' },
            { id: 'movimentos', label: 'Movimentos', icon: '⚡' }
        ];
        
        // Adiciona Grimório apenas para classes com sistema de magias implementado
        const spellcastingClasses = ['clerigo', 'mago'];
        const hasClericSpellAbility = Store.hasClericSpellAbility && Store.hasClericSpellAbility();
        
        if (spellcastingClasses.includes(character?.classId) || hasClericSpellAbility) {
            sections.push({ id: 'grimorio', label: 'Grimório', icon: '📖' });
        }

        nav.innerHTML = sections.map(section => `
            <button type="button" 
                    class="nav-item ${section.id === this.currentSection ? 'nav-item-active' : ''}"
                    data-section="${section.id}"
                    aria-current="${section.id === this.currentSection ? 'page' : 'false'}">
                <span class="nav-icon">${section.icon}</span>
                <span class="nav-label">${section.label}</span>
            </button>
        `).join('');

        // Renderiza os dots de indicador de scroll
        const scrollIndicator = document.querySelector('.nav-scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.innerHTML = sections.map((section, index) => `
                <span class="nav-scroll-dot ${section.id === this.currentSection ? 'active' : ''}" 
                      data-index="${index}"></span>
            `).join('');
        }

        // Eventos de navegação
        nav.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const section = item.getAttribute('data-section');
                this.navigateToSection(section);
            });
        });

        // Configura scroll indicators e eventos
        this.setupNavScroll(nav, navWrapper, sections);
    },

    /**
     * Configura o comportamento de scroll da navbar mobile
     */
    setupNavScroll(nav, navWrapper, sections) {
        if (!nav || !navWrapper) return;

        const updateScrollIndicators = () => {
            const canScrollLeft = nav.scrollLeft > 10;
            const canScrollRight = nav.scrollLeft < (nav.scrollWidth - nav.clientWidth - 10);
            
            navWrapper.classList.toggle('can-scroll-left', canScrollLeft);
            navWrapper.classList.toggle('can-scroll-right', canScrollRight);
            
            // Atualiza dots baseado na posição de scroll
            const scrollIndicator = document.querySelector('.nav-scroll-indicator');
            if (scrollIndicator && sections.length > 0) {
                const scrollPercentage = nav.scrollLeft / (nav.scrollWidth - nav.clientWidth);
                const activeIndex = Math.round(scrollPercentage * (sections.length - 1));
                
                scrollIndicator.querySelectorAll('.nav-scroll-dot').forEach((dot, index) => {
                    dot.classList.toggle('active', index === activeIndex);
                });
            }
        };

        // Eventos de scroll
        nav.addEventListener('scroll', updateScrollIndicators, { passive: true });
        
        // Scroll inicial para o item ativo
        setTimeout(() => {
            const activeItem = nav.querySelector('.nav-item-active');
            if (activeItem) {
                activeItem.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
            updateScrollIndicators();
        }, 100);

        // Atualiza ao redimensionar
        window.addEventListener('resize', updateScrollIndicators, { passive: true });
    },

    /**
     * Navega para uma seção específica
     * @param {string} sectionId - ID da seção
     */
    navigateToSection(sectionId) {
        this.currentSection = sectionId;
        Store.setSection(sectionId);
        
        // Atualiza navegação ativa
        const nav = document.querySelector('.sheet-nav');
        let activeIndex = 0;
        
        document.querySelectorAll('.nav-item').forEach((item, index) => {
            const isActive = item.getAttribute('data-section') === sectionId;
            item.classList.toggle('nav-item-active', isActive);
            item.setAttribute('aria-current', isActive ? 'page' : 'false');
            if (isActive) activeIndex = index;
        });

        // Scroll até o item ativo na navbar
        if (nav) {
            const activeItem = nav.querySelector('.nav-item-active');
            if (activeItem) {
                activeItem.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        }

        // Atualiza dots do indicador
        const scrollIndicator = document.querySelector('.nav-scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.querySelectorAll('.nav-scroll-dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === activeIndex);
            });
        }

        // Renderiza a seção
        this.renderSection(sectionId);
        
        // Reseta o scroll para o topo ao mudar de seção
        window.scrollTo(0, 0);
    },

    /**
     * Renderiza uma seção específica
     * @param {string} sectionId - ID da seção
     */
    renderSection(sectionId) {
        const content = document.querySelector('.sheet-content');
        if (!content) return;

        content.innerHTML = '';
        content.className = `sheet-content section-${sectionId}`;

        switch (sectionId) {
            case 'personagem':
                this.renderPersonagemSection(content);
                break;
            case 'dados':
                this.renderDadosSection(content);
                break;
            case 'inventario':
                this.renderInventarioSection(content);
                break;
            case 'movimentos':
                this.renderMovimentosSection(content);
                break;
            case 'grimorio':
                this.renderGrimorioSection(content);
                break;
            case 'referencia':
                this.renderReferenciaSection(content);
                break;
        }
    },

    /**
     * Renderiza a seção Personagem
     * @param {HTMLElement} container - Container da seção
     */
    renderPersonagemSection(container) {
        const character = Store.get('character');
        const classData = getClassById(character.classId);

        // Encontrar dados da raça selecionada para verificar flags especiais
        const selectedRaceData = character.race 
            ? classData.races.find(r => r.name === character.race) 
            : null;

        container.innerHTML = `
            <div class="section-personagem">
                <!-- Identidade do Personagem -->
                <div class="card identidade-card">
                    <h3 class="card-title">Identidade do Personagem</h3>
                    <div class="identidade-grid">
                        <div class="identidade-col">
                            <div class="identidade-label">Raça</div>
                            <div class="race-cards">
                                ${classData.races.map(race => `
                                    <div class="race-card${character.race === race.name ? ' selected' : ''}" data-race="${race.name}">
                                        <div class="race-title">${race.name}</div>
                                        <div class="race-desc">${race.description}</div>
                                        ${race.requiresClericSpellChoice ? `
                                            <div class="race-special-note">
                                                <em>⚠️ ${race.clericSpellChoiceNote || 'Escolha de feitiço será implementada.'}</em>
                                            </div>
                                        ` : ''}
                                        ${race.requiresChoice && race.choiceType === 'text' ? `
                                            <div class="race-choice-input ${character.race === race.name ? 'visible' : ''}">
                                                <label class="race-choice-label">${race.choicePrompt || 'Escolha:'}</label>
                                                <input type="text" 
                                                       class="race-choice-text" 
                                                       data-race="${race.name}"
                                                       placeholder="${race.choicePlaceholder || ''}"
                                                       value="${character.classSpecific?.raceChoice?.[race.id] || ''}"
                                                />
                                            </div>
                                        ` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        <div class="identidade-col">
                            <div class="identidade-label">Alinhamento <span class="xp-indicator-small">⭐ Gera XP</span></div>
                            <div class="alignment-cards">
                                ${classData.alignments.map(align => `
                                    <div class="alignment-card${character.alignment === align.name ? ' selected' : ''}" data-alignment="${align.name}">
                                        <div class="alignment-title">${align.name}</div>
                                        <div class="alignment-desc">${align.description}</div>
                                        <div class="alignment-xp-note">Quando cumprir: marque XP</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Vínculos -->
                <div class="card">
                    <h3 class="card-title">Vínculos</h3>
                    
                    <!-- Vínculos Sugeridos -->
                    <div class="suggested-bonds-list">
                        ${classData.suggestedBonds.map((bondTemplate, index) => {
                            const bondData = character.suggestedBonds?.[index] || { enabled: false, names: {} };
                            return `
                            <div class="suggested-bond-item ${bondData.enabled ? 'enabled' : ''}" data-suggested-bond-index="${index}">
                                <input type="checkbox" 
                                       class="suggested-bond-toggle" 
                                       ${bondData.enabled ? 'checked' : ''}
                                       id="suggested-bond-${index}">
                                <label class="suggested-bond-text" for="suggested-bond-${index}">
                                    ${this.renderBondTemplate(bondTemplate, bondData.names || {}, index)}
                                </label>
                            </div>
                        `}).join('')}
                    </div>
                    
                    <!-- Vínculos Customizados -->
                    ${character.customBonds && character.customBonds.length > 0 ? `
                        <div class="custom-bonds-list">
                            <h4 class="bonds-subtitle">Vínculos Personalizados</h4>
                            ${character.customBonds.map((bond) => `
                                <div class="custom-bond-item" data-custom-bond-id="${bond.id}">
                                    <input type="checkbox" 
                                           class="custom-bond-resolved" 
                                           ${bond.resolved ? 'checked' : ''}
                                           id="custom-bond-${bond.id}">
                                    <textarea class="custom-bond-text" 
                                              placeholder="Escreva seu vínculo personalizado..."
                                              rows="2">${bond.text}</textarea>
                                    <button type="button" class="btn-icon custom-bond-delete" aria-label="Remover vínculo">
                                        ✕
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    <button type="button" class="btn btn-secondary btn-small add-custom-bond">
                        + Adicionar Vínculo Personalizado
                    </button>
                </div>

                <!-- História, Objetivo, Aparência e Notas -->
                <div class="card">
                    <h3 class="card-title">Anotações do Personagem</h3>
                    
                    <div class="notes-field">
                        <label class="notes-label">Aparência</label>
                        <textarea class="textarea character-appearance" 
                                  placeholder="Descreva a aparência do seu personagem..."
                                  rows="3">${character.appearance || ''}</textarea>
                    </div>
                    
                    <div class="notes-field">
                        <label class="notes-label">História</label>
                        <textarea class="textarea character-history" 
                                  placeholder="Conte a história e o passado do seu personagem..."
                                  rows="5">${character.history || ''}</textarea>
                    </div>
                    
                    <div class="notes-field">
                        <label class="notes-label">Objetivo</label>
                        <textarea class="textarea character-goal" 
                                  placeholder="Qual é o objetivo ou motivação do seu personagem?"
                                  rows="3">${character.goal || ''}</textarea>
                    </div>
                    
                    <div class="notes-field">
                        <label class="notes-label">Notas Gerais</label>
                        <textarea class="textarea character-notes" 
                                  placeholder="Outras anotações, itens especiais, contatos, etc..."
                                  rows="4">${character.notes || ''}</textarea>
                    </div>
                </div>
            </div>
        `;

        this.attachPersonagemEvents(container, classData);
        this.updateRaceBonus();
        this.updateAlignmentDescription();
    },

    /**
     * Anexa eventos da seção Personagem
     * @param {HTMLElement} container - Container
     * @param {Object} classData - Dados da classe
     */
    attachPersonagemEvents(container, classData) {
        // Raça - cards
        container.querySelectorAll('.race-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Não re-renderizar se clicou no input de escolha
                if (e.target.classList.contains('race-choice-text')) return;
                
                const race = card.getAttribute('data-race');
                Store.setCharacterProperty('race', race);
                this.renderPersonagemSection(container);
            });
        });
        
        // Raça - campos de escolha adicional (ex: Elfo do Guerreiro)
        container.querySelectorAll('.race-choice-text').forEach(input => {
            input.addEventListener('input', (e) => {
                e.stopPropagation(); // Prevenir o click do card pai
                const raceName = input.getAttribute('data-race');
                const raceData = classData.races.find(r => r.name === raceName);
                if (!raceData) return;
                
                const character = Store.get('character');
                if (!character.classSpecific) {
                    character.classSpecific = {};
                }
                if (!character.classSpecific.raceChoice) {
                    character.classSpecific.raceChoice = {};
                }
                character.classSpecific.raceChoice[raceData.id] = input.value;
                Store.setCharacterProperty('classSpecific', character.classSpecific);
            });
            
            // Prevenir que o click no input selecione o card
            input.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });

        // Alinhamento - cards
        container.querySelectorAll('.alignment-card').forEach(card => {
            card.addEventListener('click', () => {
                const alignment = card.getAttribute('data-alignment');
                Store.setCharacterProperty('alignment', alignment);
                this.renderPersonagemSection(container);
            });
        });

        // Vínculos Sugeridos - toggle
        container.querySelectorAll('.suggested-bond-item').forEach(item => {
            const index = parseInt(item.getAttribute('data-suggested-bond-index'));
            const checkbox = item.querySelector('.suggested-bond-toggle');

            checkbox?.addEventListener('change', () => {
                this.toggleSuggestedBond(index, checkbox.checked);
            });
        });

        // Vínculos Sugeridos - inputs de nome
        container.querySelectorAll('.bond-name-input').forEach(input => {
            input.addEventListener('change', () => {
                const bondIndex = parseInt(input.getAttribute('data-bond-index'));
                const nameIndex = parseInt(input.getAttribute('data-name-index'));
                this.updateSuggestedBondName(bondIndex, nameIndex, input.value);
            });
        });

        // Vínculos Customizados
        container.querySelectorAll('.custom-bond-item').forEach(item => {
            const id = item.getAttribute('data-custom-bond-id');
            const checkbox = item.querySelector('.custom-bond-resolved');
            const textarea = item.querySelector('.custom-bond-text');
            const deleteBtn = item.querySelector('.custom-bond-delete');

            checkbox?.addEventListener('change', () => {
                this.updateCustomBond(id, { resolved: checkbox.checked });
            });

            textarea?.addEventListener('change', () => {
                this.updateCustomBond(id, { text: textarea.value });
            });

            deleteBtn?.addEventListener('click', () => {
                this.removeCustomBond(id);
            });
        });

        // Adicionar vínculo customizado
        container.querySelector('.add-custom-bond')?.addEventListener('click', () => {
            this.addCustomBond();
        });

        // Aparência
        const appearance = container.querySelector('.character-appearance');
        appearance?.addEventListener('change', () => {
            Store.setCharacterProperty('appearance', appearance.value);
        });

        // História
        const history = container.querySelector('.character-history');
        history?.addEventListener('change', () => {
            Store.setCharacterProperty('history', history.value);
        });

        // Objetivo
        const goal = container.querySelector('.character-goal');
        goal?.addEventListener('change', () => {
            Store.setCharacterProperty('goal', goal.value);
        });

        // Notas
        const notes = container.querySelector('.character-notes');
        notes?.addEventListener('change', () => {
            Store.setCharacterProperty('notes', notes.value);
        });
    },

    /**
     * Renderiza a seção Dados
     * @param {HTMLElement} container - Container da seção
     */
    renderDadosSection(container) {
        const character = Store.get('character');
        const calculated = Store.getCalculatedValues();
        const classData = getClassById(character.classId);
        
        // Verifica se os atributos foram definidos via modal
        const attributesSet = character.attributesSet || false;
        const BASE_VALUES = [16, 15, 13, 12, 9, 8];
        const hasValidAttributes = BASE_VALUES.every(v => 
            Object.values(character.attributes).includes(v)
        );

        container.innerHTML = `
            <div class="section-dados">
                <!-- Atributos -->
                <div class="card">
                    <div class="card-header-with-action">
                        <h3 class="card-title">Atributos</h3>
                        <button type="button" class="btn-edit-modal" id="btn-edit-attributes">
                            <span class="btn-edit-modal-icon">🎲</span>
                            ${attributesSet || hasValidAttributes ? 'Editar Atributos' : 'Definir Atributos'}
                        </button>
                    </div>
                    
                    ${attributesSet || hasValidAttributes ? `
                        <!-- Exibição dos atributos finais -->
                        <div class="attributes-display-grid">
                            ${['for', 'des', 'con', 'int', 'sab', 'car'].map(attr => {
                                const mod = calculated.modifiers[attr];
                                const modClass = mod > 0 ? 'mod-positive' : mod < 0 ? 'mod-negative' : 'mod-neutral';
                                return `
                                    <div class="attribute-display-box">
                                        <span class="attribute-display-name">${attr.toUpperCase()}</span>
                                        <span class="attribute-display-value">${character.attributes[attr]}</span>
                                        <span class="attribute-display-mod ${modClass}">
                                            ${mod >= 0 ? '+' : ''}${mod}
                                        </span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    ` : `
                        <!-- Atributos não definidos -->
                        <div class="attributes-not-set">
                            <div class="attributes-not-set-icon">🎲</div>
                            <p class="attributes-not-set-text">
                                Clique em "Definir Atributos" para distribuir os valores base entre seus atributos.
                            </p>
                        </div>
                    `}
                </div>

                <!-- Status Vital -->
                <div class="card">
                    <h3 class="card-title">Status Vital</h3>
                    <div class="vital-stats-grid">
                        <div class="vital-stat vital-hp">
                            <label class="vital-label">Pontos de Vida</label>
                            <div class="vital-input-group">
                                <button type="button" class="btn-icon hp-decrease">−</button>
                                <input type="number" 
                                       class="vital-current hp-current" 
                                       value="${character.currentHP}"
                                       min="0" 
                                       max="${calculated.maxHP}">
                                <span class="vital-separator">/</span>
                                <span class="vital-max hp-max">${calculated.maxHP}</span>
                                <button type="button" class="btn-icon hp-increase">+</button>
                            </div>
                            <div class="hp-bar">
                                <div class="hp-bar-fill" style="width: ${(character.currentHP / calculated.maxHP) * 100}%"></div>
                            </div>
                        </div>

                        <div class="vital-stat vital-armor">
                            <label class="vital-label">Armadura</label>
                            <div class="vital-display">
                                <span class="armor-value">${calculated.totalArmor}</span>
                                ${calculated.unencumberedBonus > 0 ? '<span class="armor-bonus-indicator" title="Desimpedido e Ileso ativo">🛡️</span>' : ''}
                            </div>
                        </div>

                        <div class="vital-stat vital-damage">
                            <label class="vital-label">Dano Base</label>
                            <div class="vital-display">
                                <span class="damage-value">${classData.baseDamage}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Experiência e Nível -->
                <div class="card">
                    <h3 class="card-title">Experiência & Nível</h3>
                    <div class="xp-level-section">
                        <div class="level-display">
                            <span class="level-label">Nível</span>
                            <span class="level-value">${character.level}</span>
                        </div>
                        
                        <div class="xp-display">
                            <div class="xp-controls">
                                <button type="button" class="btn-icon xp-decrease" title="Reduzir XP">−</button>
                                <div class="xp-values">
                                    <input type="number" 
                                           class="xp-current" 
                                           value="${character.xp}"
                                           min="0">
                                    <span class="xp-separator">/</span>
                                    <span class="xp-needed">${calculated.xpToLevel}</span>
                                </div>
                                <button type="button" class="btn-icon xp-increase" title="Adicionar XP">+</button>
                            </div>
                            <p class="xp-help">
                                ${character.xp >= calculated.xpToLevel 
                                    ? '✨ Pronto para subir de nível!' 
                                    : `Faltam ${calculated.xpToLevel - character.xp} XP para o próximo nível`}
                            </p>
                        </div>
                        
                        <div class="level-up-section ${character.xp >= calculated.xpToLevel ? 'can-level-up' : ''}">
                            <button type="button" class="btn-level-up" title="Subir de Nível" ${character.xp >= calculated.xpToLevel ? '' : 'disabled'}>
                                <span class="level-up-icon">⭐</span>
                                <span class="level-up-text">Lv UP</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Debilidades -->
                <div class="card">
                    <h3 class="card-title">Debilidades</h3>
                    <div class="debilities-grid">
                        ${[
                            { attr: 'for', name: 'Fraco', desc: '-1 em FOR' },
                            { attr: 'des', name: 'Trêmulo', desc: '-1 em DES' },
                            { attr: 'con', name: 'Doente', desc: '-1 em CON' },
                            { attr: 'int', name: 'Atordoado', desc: '-1 em INT' },
                            { attr: 'sab', name: 'Confuso', desc: '-1 em SAB' },
                            { attr: 'car', name: 'Marcado', desc: '-1 em CAR' }
                        ].map(deb => `
                            <label class="debility-item">
                                <input type="checkbox" 
                                       class="debility-checkbox"
                                       data-debility="${deb.attr}"
                                       ${character.debilities?.[deb.attr] ? 'checked' : ''}>
                                <span class="debility-info">
                                    <span class="debility-name">${deb.name}</span>
                                    <span class="debility-desc">${deb.desc}</span>
                                </span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        this.attachDadosEvents(container);
    },

    /**
     * Anexa eventos da seção Dados
     * @param {HTMLElement} container - Container
     */
    attachDadosEvents(container) {
        const character = Store.get('character');
        const calculated = Store.getCalculatedValues();

        // Botão de editar atributos (abre modal)
        const btnEditAttributes = container.querySelector('#btn-edit-attributes');
        btnEditAttributes?.addEventListener('click', () => {
            if (typeof AttributesModal !== 'undefined') {
                AttributesModal.open();
            }
        });

        // HP
        const hpCurrent = container.querySelector('.hp-current');
        const hpDecrease = container.querySelector('.hp-decrease');
        const hpIncrease = container.querySelector('.hp-increase');

        hpCurrent?.addEventListener('change', () => {
            const value = Math.max(0, Math.min(calculated.maxHP, parseInt(hpCurrent.value) || 0));
            Store.setCharacterProperty('currentHP', value);
            this.updateHPBar();
        });

        hpDecrease?.addEventListener('click', () => {
            const current = Store.get('character').currentHP;
            if (current > 0) {
                Store.setCharacterProperty('currentHP', current - 1);
                hpCurrent.value = current - 1;
                this.updateHPBar();
            }
        });

        hpIncrease?.addEventListener('click', () => {
            const current = Store.get('character').currentHP;
            if (current < calculated.maxHP) {
                Store.setCharacterProperty('currentHP', current + 1);
                hpCurrent.value = current + 1;
                this.updateHPBar();
            }
        });

        // XP
        const xpCurrent = container.querySelector('.xp-current');
        const xpDecrease = container.querySelector('.xp-decrease');
        const xpIncrease = container.querySelector('.xp-increase');
        const btnLevelUp = container.querySelector('.btn-level-up');

        xpCurrent?.addEventListener('change', () => {
            const value = Math.max(0, parseInt(xpCurrent.value) || 0);
            Store.setCharacterProperty('xp', value);
            this.updateXPLevelDisplay(container);
        });

        xpDecrease?.addEventListener('click', () => {
            const character = Store.get('character');
            const currentXP = character.xp;
            const currentLevel = character.level;
            
            if (currentXP > 0) {
                // Reduz XP normalmente
                Store.setCharacterProperty('xp', currentXP - 1);
                xpCurrent.value = currentXP - 1;
                this.updateXPLevelDisplay(container);
            } else if (currentXP === 0 && currentLevel > 1) {
                // XP zerado e nível > 1: reduz nível e recalcula XP
                // XP necessário do nível anterior = (nível anterior) + 7
                const previousLevelXPNeeded = (currentLevel - 1) + 7;
                const newXP = previousLevelXPNeeded - 1; // Fica com XP máximo -1 do nível anterior
                Store.setCharacterProperty('level', currentLevel - 1);
                Store.setCharacterProperty('xp', newXP);
                xpCurrent.value = newXP;
                this.updateXPLevelDisplay(container);
            }
        });

        xpIncrease?.addEventListener('click', () => {
            const current = Store.get('character').xp;
            Store.setCharacterProperty('xp', current + 1);
            xpCurrent.value = current + 1;
            this.updateXPLevelDisplay(container);
        });

        // Botão de Subir de Nível
        btnLevelUp?.addEventListener('click', () => {
            const character = Store.get('character');
            const xpNeeded = Helpers.calculateXPToLevel(character.level);
            
            if (character.xp >= xpNeeded && character.level < 10) {
                // Calcula novo nível e XP restante
                const newLevel = character.level + 1;
                const remainingXP = character.xp - xpNeeded;
                
                // Atualiza a Store
                Store.setCharacterProperty('level', newLevel);
                Store.setCharacterProperty('xp', remainingXP);
                xpCurrent.value = remainingXP;
                this.updateXPLevelDisplay(container);
                
                // Feedback visual com o nível correto
                this.showLevelUpFeedback(newLevel);
            }
        });

        // Debilidades
        container.querySelectorAll('.debility-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const attr = checkbox.getAttribute('data-debility');
                const character = Store.get('character');
                const debilities = { ...character.debilities, [attr]: checkbox.checked };
                Store.setCharacterProperty('debilities', debilities);
                
                // Re-renderiza a seção de dados para atualizar os modificadores
                this.renderSection('dados');
            });
        });
    },

    /**
     * Renderiza a seção Inventário
     * @param {HTMLElement} container - Container da seção
     */
    renderInventarioSection(container) {
        const character = Store.get('character');
        const classData = getClassById(character.classId);
        const calculated = Store.getCalculatedValues();
        
        // Verifica se o equipamento inicial já foi escolhido via modal
        const equipmentChosen = character.equipmentChosen || false;
        const hasStartingEquipment = classData.startingEquipment;
        const hasInventoryItems = (character.inventory && character.inventory.length > 0);
        
        container.innerHTML = `
            <div class="section-inventario">
                <!-- Carga -->
                <div class="card">
                    <h3 class="card-title">Carga</h3>
                    <div class="load-display">
                        <span class="load-current">${calculated.currentLoad || 0}</span>
                        <span class="load-separator">/</span>
                        <span class="load-max">${calculated.maxLoad}</span>
                        <span class="load-label">peso</span>
                    </div>
                    <div class="load-bar">
                        <div class="load-bar-fill" style="width: ${Math.min(100, ((calculated.currentLoad || 0) / calculated.maxLoad) * 100)}%"></div>
                    </div>
                </div>
                
                ${hasStartingEquipment && !equipmentChosen ? `
                <!-- Equipamento Inicial -->
                <div class="card">
                    <div class="card-header-with-action">
                        <h3 class="card-title">Equipamento Inicial</h3>
                        <button type="button" class="btn-edit-modal" id="btn-edit-equipment">
                            <span class="btn-edit-modal-icon">🎒</span>
                            Selecionar Equipamento
                        </button>
                    </div>
                    
                    <div class="attributes-not-set">
                        <div class="attributes-not-set-icon">🎒</div>
                        <p class="attributes-not-set-text">
                            Clique em "Selecionar Equipamento" para escolher seu equipamento inicial.
                        </p>
                    </div>
                </div>
                ` : ''}
                
                <!-- Inventário Atual -->
                <div class="card">
                    <h3 class="card-title">Inventário</h3>
                    
                    ${hasInventoryItems ? `
                        <div class="inventory-container"></div>
                    ` : `
                        ${!hasStartingEquipment || equipmentChosen ? `
                            <p class="empty-inventory-text">Seu inventário está vazio.</p>
                        ` : ''}
                    `}
                    
                    <div class="inventory-actions">
                        <button type="button" class="btn btn-secondary btn-small open-equipment-library">
                            📚 Biblioteca
                        </button>
                        <button type="button" class="btn btn-ghost btn-small toggle-create-item">
                            ✎ Criar Item
                        </button>
                    </div>
                    
                    <div class="create-item-form hidden">
                        <div class="create-item-header">
                            <span>Novo Item</span>
                            <button type="button" class="btn-icon close-create-item">✕</button>
                        </div>
                        <div class="create-item-fields">
                            <input type="text" class="input new-item-name" placeholder="Nome do item">
                            <input type="number" class="input new-item-weight" placeholder="Peso" min="0" value="0">
                            <input type="text" class="input new-item-tags" placeholder="Tags (separadas por vírgula)">
                        </div>
                        <button type="button" class="btn btn-primary btn-small confirm-create-item">
                            Criar Item
                        </button>
                    </div>
                </div>
                
                <!-- Moedas -->
                <div class="card">
                    <h3 class="card-title">Moedas</h3>
                    <div class="coins-display">
                        <span class="coins-icon">🪙</span>
                        <input type="number" 
                               class="coins-input" 
                               value="${character.coins || 0}"
                               min="0">
                        <span class="coins-label">moedas de ouro</span>
                    </div>
                </div>
            </div>
        `;
        
        // Renderiza itens do inventário se houver
        if (hasInventoryItems) {
            const inventoryContainer = container.querySelector('.inventory-container');
            if (inventoryContainer) {
                // Usa window.InventoryItem para garantir que pega o sistema de cards
                const inventoryEl = window.InventoryItem.renderInventory(
                    character.inventory || [],
                    { editable: true, showDelete: true }
                );
                inventoryContainer.appendChild(inventoryEl);
            }
        }
        
        this.attachInventarioEvents(container, classData);
    },

    /**
     * Anexa eventos da seção Inventário
     */
    attachInventarioEvents(container, classData) {
        // Botão de editar equipamento inicial (abre modal)
        const btnEditEquipment = container.querySelector('#btn-edit-equipment');
        btnEditEquipment?.addEventListener('click', () => {
            if (typeof EquipmentModal !== 'undefined') {
                EquipmentModal.open();
            }
        });
        
        // Input de moedas
        const coinsInput = container.querySelector('.coins-input');
        coinsInput?.addEventListener('change', () => {
            const value = Math.max(0, parseInt(coinsInput.value) || 0);
            Store.setCharacterProperty('coins', value);
            coinsInput.value = value;
        });
        
        // Adicionar item da biblioteca (futuro)
        // Abrir biblioteca de equipamentos
        container.querySelector('.open-equipment-library')?.addEventListener('click', () => {
            if (window.EquipmentLibraryModal) {
                window.EquipmentLibraryModal.open();
            }
        });
        
        // Toggle formulário de criação
        container.querySelector('.toggle-create-item')?.addEventListener('click', () => {
            const form = container.querySelector('.create-item-form');
            form?.classList.toggle('hidden');
        });
        
        // Fechar formulário de criação
        container.querySelector('.close-create-item')?.addEventListener('click', () => {
            const form = container.querySelector('.create-item-form');
            form?.classList.add('hidden');
        });
        
        // Criar item personalizado
        container.querySelector('.confirm-create-item')?.addEventListener('click', () => {
            const nameInput = container.querySelector('.new-item-name');
            const weightInput = container.querySelector('.new-item-weight');
            const tagsInput = container.querySelector('.new-item-tags');
            
            const name = nameInput?.value?.trim();
            if (!name) {
                nameInput?.focus();
                return;
            }
            
            const newItem = {
                id: `item-${Date.now()}`,
                name: name,
                weight: parseInt(weightInput?.value) || 0,
                quantity: 1,
                tags: tagsInput?.value?.split(',').map(t => t.trim()).filter(Boolean) || []
            };
            
            window.InventoryItem.addItem(newItem);
            
            // Limpa campos e esconde formulário
            nameInput.value = '';
            weightInput.value = '0';
            tagsInput.value = '';
            container.querySelector('.create-item-form')?.classList.add('hidden');
            
            this.renderInventarioSection(container);
        });
    },

    /**
     * Renderiza a seção Movimentos
     * @param {HTMLElement} container - Container da seção
     */
    renderMovimentosSection(container) {
        const character = Store.get('character');

        container.innerHTML = `
            <div class="section-movimentos">
                <div class="movements-class-only"></div>
            </div>
        `;

        // Renderiza apenas os movimentos da classe
        const classSection = container.querySelector('.movements-class-only');
        const classMoves = MovementCard.renderClassMoves(
            character.classId,
            character.acquiredMoves || []
        );
        classSection.appendChild(classMoves);
    },

    /**
     * Renderiza a seção de movimentos de multiclasse
     * @param {Array} multiclassMoves - Movimentos obtidos via multiclasse
     * @returns {HTMLElement}
     */
    renderMulticlassMovesSection(multiclassMoves) {
        const section = document.createElement('div');
        section.className = 'movement-section multiclass-section';
        
        section.innerHTML = `
            <div class="movement-section-header">
                <h3 class="movement-section-title">🌟 Movimentos de Multiclasse</h3>
                <span class="movement-section-count">${multiclassMoves.length} movimento${multiclassMoves.length > 1 ? 's' : ''}</span>
            </div>
            <div class="movement-grid multiclass-moves-grid"></div>
        `;
        
        const grid = section.querySelector('.multiclass-moves-grid');
        
        multiclassMoves.forEach(move => {
            const classData = getClassById(move.fromClass);
            const displayData = CLASS_LIST.find(c => c.id === move.fromClass);
            
            // Busca dados completos do movimento se não estiverem salvos
            let moveDescription = move.description;
            let moveResults = move.results;
            let moveTrigger = move.trigger;
            let moveAttribute = move.attribute;
            let moveOptions = move.options;
            let moveLoreOptions = move.loreOptions;
            
            // Sempre busca do original para garantir dados completos
            if (classData) {
                const allMoves = [
                    ...(classData.startingMoves || []),
                    ...(classData.advancedMoves2_5 || []),
                    ...(classData.advancedMoves6_10 || [])
                ];
                const originalMove = allMoves.find(m => m.id === move.moveId);
                if (originalMove) {
                    moveDescription = moveDescription || originalMove.description;
                    moveResults = moveResults || originalMove.results;
                    moveTrigger = moveTrigger || originalMove.trigger;
                    moveAttribute = moveAttribute || originalMove.attribute;
                    moveOptions = moveOptions || originalMove.options;
                    moveLoreOptions = moveLoreOptions || originalMove.loreOptions;
                }
            }
            
            // Renderiza opções se existirem
            let optionsHtml = '';
            if (moveOptions && moveOptions.length > 0) {
                optionsHtml = `
                    <div class="movement-options">
                        <ul class="movement-options-list">
                            ${moveOptions.map(opt => `<li>${opt}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }
            if (moveLoreOptions && moveLoreOptions.length > 0) {
                optionsHtml = `
                    <div class="movement-options">
                        <span class="options-label">Áreas de conhecimento:</span>
                        <ul class="movement-options-list">
                            ${moveLoreOptions.map(opt => `<li>${opt}</li>`).join('')}
                        </ul>
                    </div>
                `;
            }
            
            const card = document.createElement('div');
            card.className = 'movement-card movement-card-acquired movement-card-multiclass';
            card.style.setProperty('--class-color', displayData?.color || '#666');
            
            card.innerHTML = `
                <div class="movement-header">
                    <span class="movement-badge movement-badge-multiclass" title="De: ${classData?.name || move.fromClass}">
                        ${displayData?.icon || '📜'} ${classData?.name || move.fromClass}
                    </span>
                    ${moveAttribute ? `<span class="movement-attribute">+${moveAttribute.toUpperCase()}</span>` : ''}
                </div>
                <h4 class="movement-name">${move.name}</h4>
                ${moveTrigger ? `<p class="movement-trigger">${moveTrigger}</p>` : ''}
                <div class="movement-description">${Helpers.formatMovementText(moveDescription || '')}</div>
                ${optionsHtml}
                ${moveResults ? `
                    <div class="movement-results">
                        ${moveResults.success ? `<div class="result result-success"><strong>10+:</strong> ${moveResults.success}</div>` : ''}
                        ${moveResults.partial ? `<div class="result result-partial"><strong>7-9:</strong> ${moveResults.partial}</div>` : ''}
                        ${moveResults.fail ? `<div class="result result-fail"><strong>6-:</strong> ${moveResults.fail}</div>` : ''}
                    </div>
                ` : ''}
            `;
            
            grid.appendChild(card);
        });
        
        return section;
    },

    /**
     * Renderiza a seção Grimório
     * @param {HTMLElement} container - Container da seção
     */
    renderGrimorioSection(container) {
        const character = Store.get('character');
        
        container.innerHTML = '<div class="section-grimorio"></div>';
        
        // Verifica se o componente Grimoire existe
        if (typeof Grimoire !== 'undefined') {
            // Verifica se é uma classe que tem grimório através de Favor Divino/Deuses em Meio à Desolação
            const hasClericSpellAbility = Store.hasClericSpellAbility && Store.hasClericSpellAbility();
            
            if (hasClericSpellAbility && character.classId !== 'clerigo' && character.classId !== 'mago') {
                // Renderiza grimório de clérigo para paladino/ranger com nível de clérigo
                const clericLevel = Store.getClericLevel();
                const grimoireContent = Grimoire.renderClericGrimoireForOtherClass(character, clericLevel);
                container.firstChild.appendChild(grimoireContent);
            } else {
                const grimoireContent = Grimoire.render(character.classId, character);
                container.firstChild.appendChild(grimoireContent);
            }
        } else {
            container.firstChild.innerHTML = `
                <div class="grimoire-placeholder">
                    <p>Grimório em desenvolvimento...</p>
                </div>
            `;
        }
    },

    /**
     * Atualiza o bônus racial exibido
     */
    updateRaceBonus() {
        // Não é mais necessário, pois a descrição da raça está sempre visível
    },

    /**
     * Atualiza a descrição do alinhamento
     */
    updateAlignmentDescription() {
        // Não é mais necessário, pois a descrição do alinhamento está sempre visível
    },

    /**
     * Atualiza a barra de HP
     */
    updateHPBar() {
        const character = Store.get('character');
        const calculated = Store.getCalculatedValues();
        const bar = document.querySelector('.hp-bar-fill');
        
        if (bar) {
            const percentage = (character.currentHP / calculated.maxHP) * 100;
            bar.style.width = `${percentage}%`;
            
            // Muda cor baseada na porcentagem
            bar.classList.remove('hp-low', 'hp-critical');
            if (percentage <= 25) {
                bar.classList.add('hp-critical');
            } else if (percentage <= 50) {
                bar.classList.add('hp-low');
            }
        }
    },

    /**
     * Atualiza o display de XP e Nível
     * @param {HTMLElement} container - Container opcional para atualização
     */
    updateXPLevelDisplay(container) {
        const character = Store.get('character');
        const calculated = Store.getCalculatedValues();
        const xpHelp = document.querySelector('.xp-help');
        const xpNeeded = document.querySelector('.xp-needed');
        const levelValue = document.querySelector('.level-value');
        const levelUpSection = document.querySelector('.level-up-section');
        const btnLevelUp = document.querySelector('.btn-level-up');
        
        const canLevelUp = character.xp >= calculated.xpToLevel && character.level < 10;
        
        if (xpHelp) {
            if (canLevelUp) {
                xpHelp.innerHTML = '✨ <strong>Pronto para subir de nível!</strong>';
            } else {
                xpHelp.textContent = `Faltam ${calculated.xpToLevel - character.xp} XP para o próximo nível`;
            }
        }
        if (xpNeeded) {
            xpNeeded.textContent = calculated.xpToLevel;
        }
        if (levelValue) {
            levelValue.textContent = character.level;
        }
        if (levelUpSection) {
            levelUpSection.classList.toggle('can-level-up', canLevelUp);
        }
        if (btnLevelUp) {
            btnLevelUp.disabled = !canLevelUp;
        }
    },

    /**
     * Mostra feedback visual ao subir de nível
     * @param {number} newLevel - Novo nível
     */
    showLevelUpFeedback(newLevel) {
        // Criar elemento de feedback
        const feedback = document.createElement('div');
        feedback.className = 'level-up-feedback';
        feedback.innerHTML = `
            <div class="level-up-feedback-content">
                <span class="level-up-feedback-icon">🎉</span>
                <span class="level-up-feedback-text">Nível ${newLevel}!</span>
            </div>
        `;
        document.body.appendChild(feedback);
        
        // Animar e remover
        setTimeout(() => {
            feedback.classList.add('fade-out');
            setTimeout(() => feedback.remove(), 500);
        }, 2000);
    },

    /**
     * Renderiza o template de um vínculo sugerido, substituindo ________________ por inputs
     * @param {string} template - Template do vínculo
     * @param {Object} names - Nomes preenchidos
     * @param {number} bondIndex - Índice do vínculo
     * @returns {string} HTML do vínculo
     */
    renderBondTemplate(template, names, bondIndex) {
        let nameIndex = 0;
        return template.replace(/________________/g, () => {
            const currentIndex = nameIndex++;
            const value = names[currentIndex] || '';
            return `<input type="text" 
                           class="bond-name-input" 
                           data-bond-index="${bondIndex}" 
                           data-name-index="${currentIndex}"
                           value="${value}"
                           placeholder="nome">`;
        });
    },

    /**
     * Toggle de um vínculo sugerido
     * @param {number} index - Índice do vínculo
     * @param {boolean} enabled - Se está habilitado
     */
    toggleSuggestedBond(index, enabled) {
        const character = Store.get('character');
        const suggestedBonds = { ...(character.suggestedBonds || {}) };
        
        if (!suggestedBonds[index]) {
            suggestedBonds[index] = { enabled: false, names: {} };
        }
        suggestedBonds[index].enabled = enabled;
        
        Store.setCharacterProperty('suggestedBonds', suggestedBonds);
        
        // Atualiza visual
        const item = document.querySelector(`[data-suggested-bond-index="${index}"]`);
        if (item) {
            item.classList.toggle('enabled', enabled);
        }
    },

    /**
     * Atualiza o nome em um vínculo sugerido
     * @param {number} bondIndex - Índice do vínculo
     * @param {number} nameIndex - Índice do nome no vínculo
     * @param {string} name - Nome
     */
    updateSuggestedBondName(bondIndex, nameIndex, name) {
        const character = Store.get('character');
        const suggestedBonds = { ...(character.suggestedBonds || {}) };
        
        if (!suggestedBonds[bondIndex]) {
            suggestedBonds[bondIndex] = { enabled: false, names: {} };
        }
        suggestedBonds[bondIndex].names[nameIndex] = name;
        
        Store.setCharacterProperty('suggestedBonds', suggestedBonds);
    },

    /**
     * Atualiza um vínculo customizado
     * @param {string} bondId - ID do vínculo
     * @param {Object} updates - Atualizações
     */
    updateCustomBond(bondId, updates) {
        const character = Store.get('character');
        const customBonds = (character.customBonds || []).map(bond => 
            bond.id === bondId ? { ...bond, ...updates } : bond
        );
        Store.setCharacterProperty('customBonds', customBonds);
    },

    /**
     * Remove um vínculo customizado
     * @param {string} bondId - ID do vínculo
     */
    removeCustomBond(bondId) {
        const character = Store.get('character');
        const customBonds = (character.customBonds || []).filter(bond => bond.id !== bondId);
        Store.setCharacterProperty('customBonds', customBonds);
        
        // Remove do DOM
        const element = document.querySelector(`[data-custom-bond-id="${bondId}"]`);
        if (element) {
            element.classList.add('removing');
            setTimeout(() => element.remove(), 300);
        }
    },

    /**
     * Adiciona um novo vínculo customizado
     */
    addCustomBond() {
        const character = Store.get('character');
        const newBond = {
            id: Helpers.generateId(),
            text: '',
            resolved: false
        };
        
        const customBonds = [...(character.customBonds || []), newBond];
        Store.setCharacterProperty('customBonds', customBonds);
        
        // Re-renderiza a seção
        const container = document.querySelector('.sheet-content');
        if (container) {
            this.renderPersonagemSection(container);
        }
    },

    /**
     * Renderiza a seção de Referência de Movimentos
     * @param {HTMLElement} container - Container da seção
     */
    renderReferenciaSection(container) {
        container.innerHTML = `
            <div class="section-referencia">
                <!-- Movimentos Básicos -->
                <div class="movement-section">
                    <div class="movement-section-header">
                        <h3 class="movement-section-title">⚔️ Movimentos Básicos</h3>
                        <div class="movement-section-info">
                            <span class="movement-section-count">${BasicMovesPage.basicMoves.length} movimentos</span>
                        </div>
                    </div>
                    <div class="movement-grid">
                        ${BasicMovesPage.basicMoves.map(move => this.renderRefMoveCard(move)).join('')}
                    </div>
                </div>

                <!-- Movimentos Especiais -->
                <div class="movement-section">
                    <div class="movement-section-header">
                        <h3 class="movement-section-title">✨ Movimentos Especiais</h3>
                        <div class="movement-section-info">
                            <span class="movement-section-count">${BasicMovesPage.specialMoves.length} movimentos</span>
                        </div>
                    </div>
                    <div class="movement-grid">
                        ${BasicMovesPage.specialMoves.map(move => this.renderRefMoveCard(move)).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Renderiza um card de movimento para a referência
     * @param {Object} move - Dados do movimento
     * @returns {string} - HTML do card
     */
    renderRefMoveCard(move) {
        return `
            <div class="movement-card">
                <div class="movement-header">
                    <h4 class="movement-name">${move.name}</h4>
                    ${move.roll ? `<span class="movement-attribute">${move.roll.replace('role+', '+')}</span>` : ''}
                </div>
                
                <p class="movement-trigger">${move.trigger}</p>
                
                ${move.rollOptions ? `
                    <ul class="movement-roll-options">
                        ${move.rollOptions.map(opt => `<li>${opt}</li>`).join('')}
                    </ul>
                ` : ''}
                
                ${move.description ? `<p class="movement-description">${move.description.replace(/\n/g, '<br>')}</p>` : ''}
                
                ${move.hit || move.partial || move.miss ? `
                    <div class="movement-results">
                        ${move.hit ? `
                            <div class="movement-result movement-result-success">
                                <span class="result-label">10+</span>
                                <span class="result-text">${move.hit}</span>
                            </div>
                        ` : ''}
                        ${move.hitOptions ? `
                            <div class="movement-result movement-result-success">
                                <span class="result-label">10+</span>
                                <ul class="result-options">
                                    ${move.hitOptions.map(opt => `<li>${opt}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                        ${move.partial ? `
                            <div class="movement-result movement-result-partial">
                                <span class="result-label">7-9</span>
                                <span class="result-text">${move.partial}</span>
                            </div>
                        ` : ''}
                        ${move.partialOptions ? `
                            <ul class="movement-partial-options">
                                ${move.partialOptions.map(opt => `<li>${opt}</li>`).join('')}
                            </ul>
                        ` : ''}
                        ${move.miss ? `
                            <div class="movement-result movement-result-fail">
                                <span class="result-label">6-</span>
                                <span class="result-text">${move.miss}</span>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
                
                ${move.options ? `
                    <ul class="movement-options-list">
                        ${move.options.map(opt => `<li>${opt}</li>`).join('')}
                    </ul>
                ` : ''}
                
                ${move.footer ? `<p class="movement-footer">${move.footer}</p>` : ''}
            </div>
        `;
    },

    /**
     * Exporta o personagem para arquivo
     */
    exportCharacter() {
        const success = Store.exportCharacter();
        
        if (success) {
            this.showNotification('Personagem exportado com sucesso!', 'success');
        } else {
            this.showNotification('Erro ao exportar personagem.', 'error');
        }
    },

    /**
     * Confirma volta para seleção de classe
     */
    confirmBack() {
        const hasChanges = Store.get('hasUnsavedChanges');
        
        if (hasChanges) {
            if (!confirm('Você tem alterações não exportadas. Deseja sair mesmo assim?')) {
                return;
            }
        }
        
        Store.navigateTo('class-selection');
    },

    /**
     * Mostra uma notificação
     * @param {string} message - Mensagem
     * @param {string} type - Tipo (success, error)
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
    },

    /**
     * Inscreve-se para mudanças de estado
     */
    subscribeToChanges() {
        Store.subscribe((newState, oldState) => {
            // Atualiza indicador de alterações não salvas
            if (newState.hasUnsavedChanges !== oldState?.hasUnsavedChanges) {
                const saveBtn = document.querySelector('.save-character');
                if (saveBtn) {
                    saveBtn.classList.toggle('has-changes', newState.hasUnsavedChanges);
                }
            }
        });

        // Listener para atualização do inventário (ex: quando item é comprado/adicionado)
        document.addEventListener('inventoryUpdated', () => {
            if (this.currentSection === 'inventario') {
                const content = document.querySelector('.sheet-content');
                if (content) {
                    this.renderInventarioSection(content);
                }
            }
        });
    },

    /**
     * Retorna o nome completo do atributo
     * @param {string} attr - Abreviação
     * @returns {string} - Nome completo
     */
    getAttributeFullName(attr) {
        const names = {
            'for': 'Força',
            'des': 'Destreza',
            'con': 'Constituição',
            'int': 'Inteligência',
            'sab': 'Sabedoria',
            'car': 'Carisma'
        };
        return names[attr.toLowerCase()] || attr;
    },

    /**
     * Capitaliza a primeira letra
     * @param {string} str - String
     * @returns {string} - String capitalizada
     */
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    /**
     * Anexa eventos globais da página
     */
    attachEvents() {
        // Atalhos de teclado
        document.addEventListener('keydown', (e) => {
            // Ctrl+S para exportar
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.exportCharacter();
            }
        });
    },

    /**
     * Limpa a página
     */
    destroy() {
        // Cleanup se necessário
    }
};

// Exporta para uso global
if (typeof window !== 'undefined') {
    window.CharacterSheetPage = CharacterSheetPage;
}
