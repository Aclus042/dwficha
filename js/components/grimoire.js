/**
 * =====================================================
 * DUNGEON WORLD - COMPONENTE: GRIMÓRIO
 * Renderiza o grimório de feitiços para classes mágicas
 * =====================================================
 */

const Grimoire = {
    // Estado local de accordions abertos (por padrão só o primeiro nível)
    openAccordions: new Set(),
    
    /**
     * Calcula quantos slots de feitiço bônus o personagem tem
     * Prodígio/O Escolhido = 1 slot, Mestre/Abençoado = +1 slot adicional
     * @param {Object} character - Dados do personagem
     * @returns {number} - Número de slots de bônus (0, 1 ou 2)
     */
    getBonusSpellSlots(character) {
        if (!character?.acquiredMoves) return 0;
        
        let slots = 0;
        const moves = character.acquiredMoves;
        
        // Mago: Prodígio (1 slot), Mestre (+1 slot)
        // Clérigo: O Escolhido (1 slot), Abençoado (+1 slot)
        if (moves.includes('prodigio') || moves.includes('escolhido')) {
            slots += 1;
        }
        if (moves.includes('mestre') || moves.includes('abencoado')) {
            slots += 1;
        }
        
        return slots;
    },
    
    /**
     * Retorna os círculos de bônus salvos do personagem
     * Cada movimento salva o círculo no momento da aquisição
     * @param {Object} character - Dados do personagem
     * @returns {Array<number>} - Array de níveis de círculo de bônus
     */
    getBonusSpellCircles(character) {
        const circles = [];
        const bonusCircles = character?.bonusSpellCircles || {};
        
        // Verifica se tem os movimentos e seus círculos salvos
        if (character?.acquiredMoves?.includes('prodigio') && bonusCircles.prodigio) {
            circles.push(bonusCircles.prodigio);
        }
        if (character?.acquiredMoves?.includes('mestre') && bonusCircles.mestre) {
            circles.push(bonusCircles.mestre);
        }
        if (character?.acquiredMoves?.includes('escolhido') && bonusCircles.escolhido) {
            circles.push(bonusCircles.escolhido);
        }
        if (character?.acquiredMoves?.includes('abencoado') && bonusCircles.abencoado) {
            circles.push(bonusCircles.abencoado);
        }
        
        return circles;
    },
    
    /**
     * Calcula o próximo círculo acima do nível atual
     * Usado quando um movimento de bônus é adquirido
     * @param {number} level - Nível atual do personagem
     * @returns {number} - Próximo círculo de feitiço
     */
    getNextSpellCircle(level) {
        if (level < 3) return 3;
        if (level < 5) return 5;
        if (level < 7) return 7;
        if (level < 9) return 9;
        return 0; // Nível 9+ não tem círculo acima
    },
    
    /**
     * Verifica se um feitiço está preparado como bônus
     * @param {string} spellId - ID do feitiço
     * @param {Object} character - Dados do personagem
     * @returns {boolean}
     */
    isSpellPreparedAsBonus(spellId, character) {
        const bonusSpells = character?.bonusPreparedSpells || [];
        return bonusSpells.includes(spellId);
    },
    
    /**
     * Calcula quantos slots de bônus estão em uso
     * @param {Object} character - Dados do personagem
     * @returns {number}
     */
    getUsedBonusSlots(character) {
        return (character?.bonusPreparedSpells || []).length;
    },
    
    /**
     * Verifica quantos slots de bônus estão disponíveis para um círculo específico
     * @param {Object} character - Dados do personagem
     * @param {number} spellLevel - Nível do círculo
     * @returns {{ total: number, used: number, available: number }}
     */
    getBonusSlotsForCircle(character, spellLevel) {
        const bonusCircles = this.getBonusSpellCircles(character);
        const total = bonusCircles.filter(c => c === spellLevel).length;
        
        // Conta quantos feitiços de bônus desse círculo já estão preparados
        const bonusPreparedSpells = character?.bonusPreparedSpells || [];
        const spellData = character.className === 'Mago' ? 
            (window.MagoSpells || []) : (window.ClerigoSpells || []);
        
        let used = 0;
        bonusPreparedSpells.forEach(spellId => {
            // Tenta buscar em ambas as listas
            let spell = null;
            if (typeof MagoSpellsHelper !== 'undefined') {
                spell = MagoSpellsHelper.getSpellById(spellId);
            }
            if (!spell && typeof ClerigoSpellsHelper !== 'undefined') {
                spell = ClerigoSpellsHelper.getSpellById(spellId);
            }
            if (spell && spell.level === spellLevel) {
                used++;
            }
        });
        
        return {
            total,
            used,
            available: total - used
        };
    },
    
    /**
     * Calcula o limite de quantidade de feitiços do Mago
     * Nível 1 = 3 feitiços, Nível 2 = 4, etc. (nível + 2)
     * @param {number} level - Nível do personagem
     * @returns {number} - Quantidade máxima de feitiços
     */
    getMagoSpellLimit(level) {
        return level + 2;
    },
    
    /**
     * Alterna o estado de um accordion
     */
    toggleAccordion(key, sectionElement) {
        const isOpen = this.openAccordions.has(key);
        
        if (isOpen) {
            this.openAccordions.delete(key);
            sectionElement.classList.remove('grimoire-accordion-open');
        } else {
            this.openAccordions.add(key);
            sectionElement.classList.add('grimoire-accordion-open');
        }
        
        // Atualiza o ícone
        const icon = sectionElement.querySelector('.grimoire-accordion-icon');
        if (icon) {
            icon.textContent = isOpen ? '▶' : '▼';
        }
    },
    
    /**
     * Renderiza o grimório completo
     * @param {string} classId - ID da classe (ex: 'clerigo')
     * @param {Object} characterData - Dados do personagem
     * @returns {HTMLElement} - Elemento do grimório
     */
    render(classId, characterData = null) {
        const container = document.createElement('div');
        container.className = 'grimoire-container';
        container.setAttribute('data-class', classId);
        
        // Header do Grimório
        const header = this.renderHeader(classId);
        container.appendChild(header);
        
        // Avisos de feitiços contínuos ativos
        const warningsSection = this.renderOngoingWarnings(characterData);
        container.appendChild(warningsSection);
        
        // Conteúdo baseado na classe
        if (classId === 'clerigo') {
            const content = this.renderClerigoGrimoire(characterData);
            container.appendChild(content);
        } else if (classId === 'mago') {
            const content = this.renderMagoGrimoire(characterData);
            container.appendChild(content);
        }
        // Adicionar outras classes aqui no futuro (druida, etc.)
        
        return container;
    },
    
    /**
     * Renderiza o header do grimório
     */
    renderHeader(classId) {
        const header = document.createElement('header');
        header.className = 'grimoire-header';
        
        const title = document.createElement('h2');
        title.className = 'grimoire-title';
        title.innerHTML = '<span class="grimoire-icon">📖</span> Grimório';
        header.appendChild(title);
        
        // Informação de limite de feitiços
        const limitInfo = document.createElement('div');
        limitInfo.className = 'grimoire-limit-info';
        limitInfo.id = 'grimoire-limit-display';
        // Será atualizado dinamicamente
        header.appendChild(limitInfo);
        
        return header;
    },
    
    /**
     * Renderiza avisos sobre feitiços contínuos ativos
     */
    renderOngoingWarnings(characterData) {
        const container = document.createElement('div');
        container.className = 'grimoire-warnings-container';
        container.id = 'grimoire-warnings';
        
        const character = characterData || Store.get('character');
        const activeSpells = character?.activeOngoingSpells || [];
        const classId = character?.classId || 'clerigo';
        
        if (activeSpells.length > 0) {
            const penaltyCount = activeSpells.length;
            
            const warningBox = document.createElement('div');
            warningBox.className = 'grimoire-ongoing-warning';
            warningBox.innerHTML = `
                <div class="grimoire-warning-header">
                    <span class="grimoire-warning-icon">⚠️</span>
                    <strong>Feitiços Contínuos Ativos: ${penaltyCount}</strong>
                </div>
                <p class="grimoire-warning-text">
                    Você possui feitiços contínuos ativos e recebe <strong>-${penaltyCount}</strong> para Conjurar Feitiços.
                </p>
                <div class="grimoire-active-spells">
                    ${activeSpells.map(spellId => {
                        // Determina qual helper usar baseado na classe
                        const spell = classId === 'mago' 
                            ? MagoSpellsHelper.getSpellById(spellId) 
                            : ClerigoSpellsHelper.getSpellById(spellId);
                        return spell ? `<span class="grimoire-active-spell-tag">${spell.name}</span>` : '';
                    }).join('')}
                </div>
            `;
            container.appendChild(warningBox);
        }
        
        return container;
    },
    
    /**
     * Atualiza os avisos de feitiços contínuos
     */
    updateOngoingWarnings() {
        const container = document.getElementById('grimoire-warnings');
        if (!container) return;
        
        const character = Store.get('character');
        const activeSpells = character?.activeOngoingSpells || [];
        const classId = character?.classId || 'clerigo';
        
        container.innerHTML = '';
        
        if (activeSpells.length > 0) {
            const penaltyCount = activeSpells.length;
            
            const warningBox = document.createElement('div');
            warningBox.className = 'grimoire-ongoing-warning';
            warningBox.innerHTML = `
                <div class="grimoire-warning-header">
                    <span class="grimoire-warning-icon">⚠️</span>
                    <strong>Feitiços Contínuos Ativos: ${penaltyCount}</strong>
                </div>
                <p class="grimoire-warning-text">
                    Você possui feitiços contínuos ativos e recebe <strong>-${penaltyCount}</strong> para Conjurar Feitiços.
                </p>
                <div class="grimoire-active-spells">
                    ${activeSpells.map(spellId => {
                        // Determina qual helper usar baseado na classe
                        const spell = classId === 'mago' 
                            ? MagoSpellsHelper.getSpellById(spellId) 
                            : ClerigoSpellsHelper.getSpellById(spellId);
                        return spell ? `<span class="grimoire-active-spell-tag">${spell.name}</span>` : '';
                    }).join('')}
                </div>
            `;
            container.appendChild(warningBox);
        }
    },
    
    /**
     * Renderiza o grimório do Mago
     * Sistema de feitiços: nível + 2 magias (3 no nível 1, 4 no nível 2, etc.)
     * Feitiços de bônus (Prodígio/Mestre) são extras e não contam para o limite
     */
    renderMagoGrimoire(characterData) {
        const content = document.createElement('div');
        content.className = 'grimoire-content grimoire-content-mago';
        
        const character = characterData || Store.get('character');
        const level = character?.level || 1;
        const preparedSpells = character?.preparedSpells || [];
        const bonusPreparedSpells = character?.bonusPreparedSpells || [];
        
        // Slots de bônus disponíveis (Prodígio/Mestre) e círculos salvos
        const bonusSlots = this.getBonusSpellSlots(character);
        const usedBonusSlots = bonusPreparedSpells.length;
        const bonusCircles = this.getBonusSpellCircles(character); // Círculos salvos
        
        // Atualizar display do limite (quantidade de feitiços: nível + 2)
        this.updateMagoLimitDisplay(level, preparedSpells, bonusSlots, usedBonusSlots);
        
        // === TRUQUES ===
        const truquesSection = this.renderMagoTruquesSection();
        content.appendChild(truquesSection);
        
        // === FEITIÇOS POR NÍVEL ===
        const spellLevels = [
            { key: 'nivel1', title: 'Feitiços de 1º Nível', minLevel: 1, spellLevel: 1 },
            { key: 'nivel3', title: 'Feitiços de 3º Nível', minLevel: 3, spellLevel: 3 },
            { key: 'nivel5', title: 'Feitiços de 5º Nível', minLevel: 5, spellLevel: 5 },
            { key: 'nivel7', title: 'Feitiços de 7º Nível', minLevel: 7, spellLevel: 7 },
            { key: 'nivel9', title: 'Feitiços de 9º Nível', minLevel: 9, spellLevel: 9 }
        ];
        
        spellLevels.forEach(levelInfo => {
            const spells = MAGO_SPELLS[levelInfo.key];
            if (spells && spells.length > 0) {
                // Conta quantos slots de bônus estão disponíveis para este círculo
                const bonusSlotsForThisCircle = bonusCircles.filter(c => c === levelInfo.spellLevel).length;
                
                // Conta quantos feitiços de bônus deste círculo já estão preparados
                const usedBonusSlotsForThisCircle = bonusPreparedSpells.filter(id => {
                    const spell = MagoSpellsHelper.getSpellById(id);
                    return spell && spell.level === levelInfo.spellLevel;
                }).length;
                
                // É seção APENAS de bônus se: está acima do nível E tem slots de bônus para este círculo
                const isBonusOnlySection = levelInfo.spellLevel > level && bonusSlotsForThisCircle > 0;
                
                // Seção tem bônus disponível: tem slots de bônus para este círculo (mesmo se já desbloqueada)
                const hasBonusSlots = bonusSlotsForThisCircle > 0;
                
                // É bloqueada se: está acima do nível E não é seção de bônus
                const isLocked = levelInfo.spellLevel > level && !isBonusOnlySection;
                
                // Não renderiza seções bloqueadas que estão muito acima do nível
                // (só mostra a próxima seção bloqueada como prévia)
                if (isLocked && levelInfo.spellLevel > level + 2) {
                    return;
                }
                
                const section = this.renderMagoSpellSection({
                    title: levelInfo.title,
                    spells: spells,
                    spellLevel: levelInfo.spellLevel,
                    characterLevel: level,
                    preparedSpells: preparedSpells,
                    bonusPreparedSpells: bonusPreparedSpells,
                    isLocked: isLocked,
                    isBonusOnlySection: isBonusOnlySection,
                    hasBonusSlots: hasBonusSlots,
                    bonusSlots: bonusSlotsForThisCircle,
                    usedBonusSlots: usedBonusSlotsForThisCircle
                });
                content.appendChild(section);
            }
        });
        
        // === FEITIÇOS EXPANDIDOS (de outras classes) ===
        // Feitiços do Grimório Expandido são extras e não contam para o limite
        const expandedSpells = character?.expandedSpells || [];
        const expandedPreparedSpells = character?.expandedPreparedSpells || [];
        if (expandedSpells.length > 0) {
            const expandedSection = this.renderExpandedSpellsSection(expandedSpells, expandedPreparedSpells);
            content.appendChild(expandedSection);
        }
        
        return content;
    },
    
    /**
     * Renderiza a seção de feitiços expandidos (Grimório Expandido) - com accordion
     * Feitiços expandidos são extras e não contam para o limite normal
     */
    renderExpandedSpellsSection(expandedSpells, expandedPreparedSpells) {
        const sectionKey = 'grimorio_expandido';
        const isOpen = this.openAccordions.has(sectionKey);
        
        const section = document.createElement('section');
        section.className = 'grimoire-section grimoire-section-expanded grimoire-accordion';
        
        if (isOpen) {
            section.classList.add('grimoire-accordion-open');
        }
        
        // Header da seção (clicável)
        const header = document.createElement('div');
        header.className = 'grimoire-section-header grimoire-accordion-header grimoire-section-header-expanded';
        header.setAttribute('data-accordion-key', sectionKey);
        
        const titleWrapper = document.createElement('div');
        titleWrapper.className = 'grimoire-accordion-title-wrapper';
        
        const toggleIcon = document.createElement('span');
        toggleIcon.className = 'grimoire-accordion-icon';
        toggleIcon.textContent = isOpen ? '▼' : '▶';
        titleWrapper.appendChild(toggleIcon);
        
        const titleEl = document.createElement('h3');
        titleEl.className = 'grimoire-section-title';
        titleEl.innerHTML = '<span class="expanded-icon">📜</span> Grimório Expandido';
        titleWrapper.appendChild(titleEl);
        
        header.appendChild(titleWrapper);
        
        // Badge de quantidade
        const badge = document.createElement('span');
        badge.className = 'grimoire-section-badge grimoire-section-badge-expanded';
        badge.textContent = `${expandedSpells.length} feitiço${expandedSpells.length !== 1 ? 's' : ''} de outras classes`;
        header.appendChild(badge);
        
        // Badge indicando que são extras
        const extraBadge = document.createElement('span');
        extraBadge.className = 'grimoire-section-badge grimoire-section-badge-bonus';
        extraBadge.innerHTML = `✨ ${expandedPreparedSpells.length}/${expandedSpells.length} extras`;
        header.appendChild(extraBadge);
        
        header.addEventListener('click', () => {
            this.toggleAccordion(sectionKey, section);
        });
        
        section.appendChild(header);
        
        // Conteúdo do accordion
        const content = document.createElement('div');
        content.className = 'grimoire-accordion-content';
        
        // Info indicando que são extras
        const bonusInfo = document.createElement('div');
        bonusInfo.className = 'grimoire-bonus-info';
        bonusInfo.innerHTML = `
            <span class="bonus-icon">📜</span>
            <span>Feitiços do Grimório Expandido são <strong>extras</strong> e não contam para seu limite normal de feitiços.</span>
        `;
        content.appendChild(bonusInfo);
        
        // Grid de feitiços expandidos
        const grid = document.createElement('div');
        grid.className = 'grimoire-spell-grid';
        
        expandedSpells.forEach(spell => {
            const card = this.renderExpandedSpellCard(spell, {
                isPrepared: expandedPreparedSpells.includes(spell.spellId)
            });
            grid.appendChild(card);
        });
        
        content.appendChild(grid);
        section.appendChild(content);
        
        return section;
    },
    
    /**
     * Renderiza um card de feitiço expandido (mesma estrutura do Mago)
     */
    renderExpandedSpellCard(spellData, options = {}) {
        const { isPrepared = false } = options;
        
        const character = Store.get('character');
        const activeOngoingSpells = character?.activeOngoingSpells || [];
        const isActive = activeOngoingSpells.includes(spellData.spellId);
        
        const card = document.createElement('div');
        card.className = `grimoire-spell-card ${isPrepared ? 'prepared' : ''} ${isActive ? 'active-ongoing' : ''}`;
        card.setAttribute('data-spell-id', spellData.spellId);
        card.setAttribute('data-spell-level', spellData.level);
        card.setAttribute('data-spell-class', 'mago');
        card.setAttribute('data-from-class', spellData.fromClass);
        
        // Header do card
        const header = document.createElement('div');
        header.className = 'grimoire-spell-header';
        
        // Badge de origem (Grimório Expandido)
        const originBadge = document.createElement('div');
        originBadge.className = 'grimoire-bonus-badge';
        originBadge.innerHTML = `<span class="bonus-icon">📜</span> Grimório Expandido (${spellData.fromClass === 'clerigo' ? 'Clérigo' : spellData.fromClass})`;
        header.appendChild(originBadge);
        
        // Controles do feitiço
        const controls = document.createElement('div');
        controls.className = 'grimoire-spell-controls';
        
        // Checkbox preparado
        const preparedControl = document.createElement('div');
        preparedControl.className = 'grimoire-control-group';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'grimoire-spell-checkbox';
        checkbox.id = `mago-expanded-${spellData.spellId}`;
        checkbox.checked = isPrepared;
        checkbox.addEventListener('change', (e) => {
            this.handleExpandedSpellPrepare(spellData.spellId, e.target.checked);
            card.classList.toggle('prepared', e.target.checked);
            
            // Habilitar/desabilitar checkbox de ativo
            const activeCheckbox = card.querySelector('.grimoire-active-checkbox');
            if (activeCheckbox) {
                activeCheckbox.disabled = !e.target.checked;
                if (!e.target.checked) {
                    activeCheckbox.checked = false;
                    card.classList.remove('active-ongoing');
                }
            }
        });
        
        const preparedLabel = document.createElement('label');
        preparedLabel.htmlFor = `mago-expanded-${spellData.spellId}`;
        preparedLabel.className = 'grimoire-control-label';
        preparedLabel.innerHTML = '<span class="control-icon">✔️</span> Preparado';
        
        preparedControl.appendChild(checkbox);
        preparedControl.appendChild(preparedLabel);
        controls.appendChild(preparedControl);
        
        // Botão Ativo (apenas para feitiços contínuos)
        if (spellData.ongoing) {
            const activeControl = document.createElement('div');
            activeControl.className = 'grimoire-control-group grimoire-control-active';
            
            const activeCheckbox = document.createElement('input');
            activeCheckbox.type = 'checkbox';
            activeCheckbox.className = 'grimoire-active-checkbox';
            activeCheckbox.id = `mago-expanded-active-${spellData.spellId}`;
            activeCheckbox.checked = isActive;
            activeCheckbox.disabled = !isPrepared;
            activeCheckbox.addEventListener('change', (e) => {
                this.handleMagoActiveToggle({ id: spellData.spellId, ongoing: true }, e.target.checked, card);
            });
            
            const activeLabel = document.createElement('label');
            activeLabel.htmlFor = `mago-expanded-active-${spellData.spellId}`;
            activeLabel.className = 'grimoire-control-label grimoire-control-label-active';
            activeLabel.innerHTML = '<span class="control-icon">🔥</span> Ativo';
            
            activeControl.appendChild(activeCheckbox);
            activeControl.appendChild(activeLabel);
            controls.appendChild(activeControl);
        }
        
        header.appendChild(controls);
        
        // Nome do feitiço
        const name = document.createElement('span');
        name.className = 'grimoire-spell-name';
        name.textContent = spellData.name;
        header.appendChild(name);
        
        // Badges
        const badges = document.createElement('div');
        badges.className = 'grimoire-spell-badges';
        
        // Badge de nível
        const levelBadge = document.createElement('span');
        levelBadge.className = 'grimoire-spell-badge grimoire-spell-badge-level';
        levelBadge.textContent = `Nível ${spellData.level}`;
        badges.appendChild(levelBadge);
        
        // Badge de Contínuo
        if (spellData.ongoing) {
            const ongoingBadge = document.createElement('span');
            ongoingBadge.className = 'grimoire-spell-badge grimoire-spell-badge-ongoing';
            ongoingBadge.textContent = 'Contínuo';
            badges.appendChild(ongoingBadge);
        }
        
        header.appendChild(badges);
        card.appendChild(header);
        
        // Descrição
        const description = document.createElement('div');
        description.className = 'grimoire-spell-description';
        description.innerHTML = this.formatSpellText(spellData.description || '');
        card.appendChild(description);
        
        return card;
    },
    
    /**
     * Manipula preparação de feitiço expandido
     * Feitiços do Grimório Expandido são EXTRAS e não contam para o limite normal
     * São armazenados em expandedPreparedSpells separadamente
     */
    handleExpandedSpellPrepare(spellId, prepared) {
        const character = Store.get('character');
        if (!character) return;
        
        // Feitiços expandidos ficam em array separado - não contam para limite
        let expandedPreparedSpells = [...(character.expandedPreparedSpells || [])];
        const preparedSpells = character?.preparedSpells || [];
        const bonusPreparedSpells = character?.bonusPreparedSpells || [];
        const bonusSlots = this.getBonusSpellSlots(character);
        
        if (prepared && !expandedPreparedSpells.includes(spellId)) {
            expandedPreparedSpells.push(spellId);
        } else if (!prepared) {
            expandedPreparedSpells = expandedPreparedSpells.filter(id => id !== spellId);
            
            // Se remover preparação, remove também dos ativos
            let activeSpells = [...(character.activeOngoingSpells || [])];
            if (activeSpells.includes(spellId)) {
                activeSpells = activeSpells.filter(id => id !== spellId);
                Store.setCharacterProperty('activeOngoingSpells', activeSpells);
            }
        }
        
        Store.setCharacterProperty('expandedPreparedSpells', expandedPreparedSpells);
        
        // Atualiza visual
        const card = document.querySelector(`[data-spell-id="${spellId}"]`);
        if (card) {
            card.classList.toggle('prepared', prepared);
        }
        
        // Atualiza limite - feitiços expandidos não contam para o limite normal
        this.updateMagoLimitDisplay(character.level, preparedSpells, bonusSlots, bonusPreparedSpells.length);
    },
    
    /**
     * Renderiza a seção de Truques do Mago (com accordion)
     */
    renderMagoTruquesSection() {
        const sectionKey = 'truques';
        const isOpen = this.openAccordions.has(sectionKey);
        
        const section = document.createElement('section');
        section.className = 'grimoire-section grimoire-section-truques grimoire-accordion';
        
        if (isOpen) {
            section.classList.add('grimoire-accordion-open');
        }
        
        // Header da seção (clicável)
        const header = document.createElement('div');
        header.className = 'grimoire-section-header grimoire-accordion-header';
        header.setAttribute('data-accordion-key', sectionKey);
        
        const titleWrapper = document.createElement('div');
        titleWrapper.className = 'grimoire-accordion-title-wrapper';
        
        const toggleIcon = document.createElement('span');
        toggleIcon.className = 'grimoire-accordion-icon';
        toggleIcon.textContent = isOpen ? '▼' : '▶';
        titleWrapper.appendChild(toggleIcon);
        
        const titleEl = document.createElement('h3');
        titleEl.className = 'grimoire-section-title';
        titleEl.textContent = 'Truques';
        titleWrapper.appendChild(titleEl);
        
        header.appendChild(titleWrapper);
        
        const badge = document.createElement('span');
        badge.className = 'grimoire-section-badge grimoire-section-badge-always';
        badge.textContent = 'Sempre Disponíveis';
        header.appendChild(badge);
        
        header.addEventListener('click', () => {
            this.toggleAccordion(sectionKey, section);
        });
        
        section.appendChild(header);
        
        // Conteúdo do accordion
        const content = document.createElement('div');
        content.className = 'grimoire-accordion-content';
        
        // Aviso informativo
        const info = document.createElement('div');
        info.className = 'grimoire-info-box';
        info.innerHTML = `
            <span class="grimoire-info-icon">ℹ️</span>
            <p>${MAGO_SPELLS.truquesInfo}</p>
        `;
        content.appendChild(info);
        
        // Grid de truques
        const grid = document.createElement('div');
        grid.className = 'grimoire-spell-grid';
        
        MAGO_SPELLS.truques.forEach(spell => {
            const card = this.renderMagoSpellCard(spell, {
                isTruque: true,
                isPrepared: true // Truques sempre estão preparados
            });
            grid.appendChild(card);
        });
        
        content.appendChild(grid);
        section.appendChild(content);
        
        return section;
    },
    
    /**
     * Renderiza uma seção de feitiços do Mago por nível (com accordion)
     */
    /**
     * Renderiza seção de feitiços do Mago por nível (com accordion)
     * Seções de bônus permitem preparar feitiços extras que não contam para o limite
     */
    renderMagoSpellSection({ title, spells, spellLevel, characterLevel, preparedSpells, bonusPreparedSpells, isLocked, isBonusOnlySection, hasBonusSlots, bonusSlots, usedBonusSlots }) {
        const sectionKey = `mago_nivel${spellLevel}`;
        const isOpen = this.openAccordions.has(sectionKey);
        
        const section = document.createElement('section');
        section.className = `grimoire-section grimoire-section-level${spellLevel} grimoire-accordion`;
        
        if (isLocked) {
            section.classList.add('grimoire-section-locked');
        }
        
        if (isBonusOnlySection) {
            section.classList.add('grimoire-section-bonus-unlocked');
        }
        
        if (isOpen) {
            section.classList.add('grimoire-accordion-open');
        }
        
        // Header da seção (clicável)
        const header = document.createElement('div');
        header.className = 'grimoire-section-header grimoire-accordion-header';
        header.setAttribute('data-accordion-key', sectionKey);
        
        const titleWrapper = document.createElement('div');
        titleWrapper.className = 'grimoire-accordion-title-wrapper';
        
        const toggleIcon = document.createElement('span');
        toggleIcon.className = 'grimoire-accordion-icon';
        toggleIcon.textContent = isOpen ? '▼' : '▶';
        titleWrapper.appendChild(toggleIcon);
        
        const titleEl = document.createElement('h3');
        titleEl.className = 'grimoire-section-title';
        titleEl.textContent = title;
        titleWrapper.appendChild(titleEl);
        
        header.appendChild(titleWrapper);
        
        if (isLocked) {
            const lockBadge = document.createElement('span');
            lockBadge.className = 'grimoire-section-badge grimoire-section-badge-locked';
            lockBadge.textContent = `Requer Nível ${spellLevel}`;
            header.appendChild(lockBadge);
        } else if (isBonusOnlySection) {
            // Seção apenas de bônus (ainda não desbloqueada naturalmente)
            const bonusBadge = document.createElement('span');
            bonusBadge.className = 'grimoire-section-badge grimoire-section-badge-bonus';
            const availableSlots = bonusSlots - usedBonusSlots;
            bonusBadge.innerHTML = `✨ Bônus (${availableSlots}/${bonusSlots} slots)`;
            header.appendChild(bonusBadge);
        } else {
            // Seção normal (desbloqueada por nível)
            const countBadge = document.createElement('span');
            countBadge.className = 'grimoire-section-badge';
            countBadge.textContent = `${spells.length} feitiços`;
            header.appendChild(countBadge);
            
            // Se tem slots de bônus para esta seção, mostrar também
            if (hasBonusSlots && bonusSlots > 0) {
                const bonusBadge = document.createElement('span');
                bonusBadge.className = 'grimoire-section-badge grimoire-section-badge-bonus';
                const availableSlots = bonusSlots - usedBonusSlots;
                bonusBadge.innerHTML = `✨ +${usedBonusSlots}/${bonusSlots} bônus`;
                header.appendChild(bonusBadge);
            }
        }
        
        // Evento de clique no header
        header.addEventListener('click', () => {
            this.toggleAccordion(sectionKey, section);
        });
        
        section.appendChild(header);
        
        // Conteúdo do accordion (grid de feitiços)
        const content = document.createElement('div');
        content.className = 'grimoire-accordion-content';
        
        // Info para seção de bônus
        if (isBonusOnlySection) {
            const bonusInfo = document.createElement('div');
            bonusInfo.className = 'grimoire-bonus-info';
            bonusInfo.innerHTML = `
                <span class="bonus-icon">✨</span>
                <span>Feitiços preparados aqui são <strong>extras</strong> e não contam para seu limite normal.</span>
            `;
            content.appendChild(bonusInfo);
        }
        
        const grid = document.createElement('div');
        grid.className = 'grimoire-spell-grid';
        
        const character = Store.get('character');
        const activeOngoingSpells = character?.activeOngoingSpells || [];
        
        spells.forEach(spell => {
            const isPrepared = preparedSpells.includes(spell.id);
            const isPreparedAsBonus = bonusPreparedSpells.includes(spell.id);
            const isActive = activeOngoingSpells.includes(spell.id);
            
            // Pode preparar se: seção normal desbloqueada OU seção de bônus com slots disponíveis
            const canPrepare = !isLocked && (!isBonusOnlySection || usedBonusSlots < bonusSlots || isPreparedAsBonus);
            
            const card = this.renderMagoSpellCard(spell, {
                isTruque: false,
                isPrepared: isPrepared || isPreparedAsBonus,
                isPreparedAsBonus: isPreparedAsBonus,
                isActive: isActive,
                isLocked: isLocked,
                canPrepare: canPrepare,
                characterLevel: characterLevel,
                isBonusOnlySection: isBonusOnlySection
            });
            grid.appendChild(card);
        });
        
        content.appendChild(grid);
        section.appendChild(content);
        
        return section;
    },
    
    /**
     * Renderiza um card de feitiço do Mago
     */
    renderMagoSpellCard(spell, options = {}) {
        const {
            isTruque = false,
            isPrepared = false,
            isPreparedAsBonus = false,
            isActive = false,
            isLocked = false,
            canPrepare = true,
            isBonusOnlySection = false
        } = options;
        
        const card = document.createElement('div');
        card.className = `grimoire-spell-card ${isPrepared ? 'prepared' : ''} ${isLocked ? 'locked' : ''} ${isActive ? 'active-ongoing' : ''} ${isPreparedAsBonus ? 'bonus-spell' : ''}`;
        card.setAttribute('data-spell-id', spell.id);
        card.setAttribute('data-spell-level', spell.level);
        card.setAttribute('data-spell-class', 'mago');
        if (isBonusOnlySection) {
            card.setAttribute('data-bonus-section', 'true');
        }
        
        // Header do card
        const header = document.createElement('div');
        header.className = 'grimoire-spell-header';
        
        // Badge de bônus se preparado como bônus
        if (isPreparedAsBonus) {
            const bonusBadge = document.createElement('div');
            bonusBadge.className = 'grimoire-bonus-badge';
            bonusBadge.innerHTML = `<span class="bonus-icon">✨</span> Feitiço Bônus (não conta para limite)`;
            header.appendChild(bonusBadge);
        }
        
        // Controles do feitiço
        const controls = document.createElement('div');
        controls.className = 'grimoire-spell-controls';
        
        // Checkbox preparado (apenas para feitiços, não truques)
        if (!isTruque) {
            const preparedControl = document.createElement('div');
            preparedControl.className = 'grimoire-control-group';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'grimoire-spell-checkbox';
            checkbox.id = `mago-spell-${spell.id}`;
            checkbox.checked = isPrepared;
            checkbox.disabled = isLocked || !canPrepare;
            checkbox.addEventListener('change', (e) => {
                this.handleMagoSpellToggle(spell, e.target.checked, card);
            });
            
            const preparedLabel = document.createElement('label');
            preparedLabel.htmlFor = `mago-spell-${spell.id}`;
            preparedLabel.className = 'grimoire-control-label';
            preparedLabel.innerHTML = '<span class="control-icon">✔️</span> Preparado';
            
            preparedControl.appendChild(checkbox);
            preparedControl.appendChild(preparedLabel);
            controls.appendChild(preparedControl);
        }
        
        // Botão Ativo (apenas para feitiços contínuos e preparados)
        if (spell.ongoing && !isTruque) {
            const activeControl = document.createElement('div');
            activeControl.className = 'grimoire-control-group grimoire-control-active';
            
            const activeCheckbox = document.createElement('input');
            activeCheckbox.type = 'checkbox';
            activeCheckbox.className = 'grimoire-active-checkbox';
            activeCheckbox.id = `mago-spell-active-${spell.id}`;
            activeCheckbox.checked = isActive;
            activeCheckbox.disabled = !isPrepared;
            activeCheckbox.addEventListener('change', (e) => {
                this.handleMagoActiveToggle(spell, e.target.checked, card);
            });
            
            const activeLabel = document.createElement('label');
            activeLabel.htmlFor = `mago-spell-active-${spell.id}`;
            activeLabel.className = 'grimoire-control-label grimoire-control-label-active';
            activeLabel.innerHTML = '<span class="control-icon">🔥</span> Ativo';
            
            activeControl.appendChild(activeCheckbox);
            activeControl.appendChild(activeLabel);
            controls.appendChild(activeControl);
        }
        
        header.appendChild(controls);
        
        // Nome do feitiço
        const name = document.createElement('span');
        name.className = 'grimoire-spell-name';
        name.textContent = spell.name;
        header.appendChild(name);
        
        // Badges
        const badges = document.createElement('div');
        badges.className = 'grimoire-spell-badges';
        
        // Badge de nível
        const levelBadge = document.createElement('span');
        levelBadge.className = 'grimoire-spell-badge grimoire-spell-badge-level';
        levelBadge.textContent = isTruque ? 'Truque' : `Nível ${spell.level}`;
        badges.appendChild(levelBadge);
        
        // Badge de Contínuo
        if (spell.ongoing) {
            const ongoingBadge = document.createElement('span');
            ongoingBadge.className = 'grimoire-spell-badge grimoire-spell-badge-ongoing';
            ongoingBadge.textContent = 'Contínuo';
            badges.appendChild(ongoingBadge);
        }
        
        header.appendChild(badges);
        card.appendChild(header);
        
        // Descrição
        const description = document.createElement('div');
        description.className = 'grimoire-spell-description';
        description.innerHTML = this.formatSpellText(spell.description);
        card.appendChild(description);
        
        return card;
    },
    
    /**
     * Manipula toggle de feitiço preparado do Mago
     * Limite normal: nível + 2 feitiços (quantidade)
     * Feitiços de bônus (Prodígio/Mestre) são extras e não contam para o limite
     */
    handleMagoSpellToggle(spell, isPrepared, cardElement) {
        const character = Store.get('character');
        if (!character) return;
        
        const isBonusSection = cardElement.getAttribute('data-bonus-section') === 'true';
        let preparedSpells = [...(character.preparedSpells || [])];
        let bonusPreparedSpells = [...(character.bonusPreparedSpells || [])];
        const level = character.level || 1;
        const spellLimit = this.getMagoSpellLimit(level); // nível + 2
        const bonusSlots = this.getBonusSpellSlots(character);
        
        // Verifica slots de bônus disponíveis para este círculo
        const bonusSlotsForCircle = this.getBonusSlotsForCircle(character, spell.level);
        
        if (isPrepared) {
            if (isBonusSection) {
                // Feitiço de seção de bônus (ainda não desbloqueada por nível)
                if (bonusSlotsForCircle.available <= 0) {
                    // Reverter checkbox
                    const checkbox = cardElement.querySelector('.grimoire-spell-checkbox');
                    if (checkbox) checkbox.checked = false;
                    
                    this.showBonusLimitWarning(bonusSlotsForCircle.used, bonusSlotsForCircle.total);
                    return;
                }
                
                bonusPreparedSpells.push(spell.id);
                cardElement.classList.add('prepared', 'bonus-spell');
            } else {
                // Seção normal - verifica limite e slots de bônus
                if (preparedSpells.length >= spellLimit) {
                    // Limite normal atingido, tenta usar slot de bônus se disponível
                    if (bonusSlotsForCircle.available > 0) {
                        // Usa slot de bônus para este círculo
                        bonusPreparedSpells.push(spell.id);
                        cardElement.classList.add('prepared', 'bonus-spell');
                    } else {
                        // Reverter checkbox
                        const checkbox = cardElement.querySelector('.grimoire-spell-checkbox');
                        if (checkbox) checkbox.checked = false;
                        
                        // Mostrar alerta
                        this.showMagoLimitWarning(preparedSpells.length, spellLimit);
                        return;
                    }
                } else {
                    // Ainda tem espaço no limite normal
                    preparedSpells.push(spell.id);
                    cardElement.classList.add('prepared');
                }
            }
            
            // Habilitar checkbox de ativo se for contínuo
            const activeCheckbox = cardElement.querySelector('.grimoire-active-checkbox');
            if (activeCheckbox) activeCheckbox.disabled = false;
        } else {
            // Desprepararar - verifica se é bônus ou normal
            if (bonusPreparedSpells.includes(spell.id)) {
                bonusPreparedSpells = bonusPreparedSpells.filter(id => id !== spell.id);
                cardElement.classList.remove('bonus-spell');
            } else {
                preparedSpells = preparedSpells.filter(id => id !== spell.id);
            }
            cardElement.classList.remove('prepared');
            
            // Se for contínuo e estava ativo, desativar
            if (spell.ongoing) {
                let activeSpells = [...(character.activeOngoingSpells || [])];
                if (activeSpells.includes(spell.id)) {
                    activeSpells = activeSpells.filter(id => id !== spell.id);
                    Store.setCharacterProperty('activeOngoingSpells', activeSpells);
                    cardElement.classList.remove('active-ongoing');
                }
                
                // Desabilitar checkbox de ativo
                const activeCheckbox = cardElement.querySelector('.grimoire-active-checkbox');
                if (activeCheckbox) {
                    activeCheckbox.checked = false;
                    activeCheckbox.disabled = true;
                }
            }
        }
        
        Store.setCharacterProperty('preparedSpells', preparedSpells);
        Store.setCharacterProperty('bonusPreparedSpells', bonusPreparedSpells);
        this.updateMagoLimitDisplay(level, preparedSpells, bonusSlots, bonusPreparedSpells.length);
        this.updateMagoOngoingWarnings();
        
        // Dispara evento
        document.dispatchEvent(new CustomEvent('spellToggled', {
            detail: { spellId: spell.id, isPrepared, isBonus: isBonusSection }
        }));
    },
    
    /**
     * Manipula toggle de feitiço ativo do Mago (contínuos)
     */
    handleMagoActiveToggle(spell, isActive, cardElement) {
        const character = Store.get('character');
        if (!character) return;
        
        let activeSpells = [...(character.activeOngoingSpells || [])];
        
        if (isActive) {
            activeSpells.push(spell.id);
            cardElement.classList.add('active-ongoing');
        } else {
            activeSpells = activeSpells.filter(id => id !== spell.id);
            cardElement.classList.remove('active-ongoing');
        }
        
        Store.setCharacterProperty('activeOngoingSpells', activeSpells);
        this.updateMagoOngoingWarnings();
        
        // Dispara evento
        document.dispatchEvent(new CustomEvent('ongoingSpellToggled', {
            detail: { spellId: spell.id, isActive, activeCount: activeSpells.length }
        }));
    },
    
    /**
     * Calcula total de níveis dos feitiços preparados do Mago
     * O Mago usa sistema de quantidade, não soma de níveis
     * Este método é mantido para compatibilidade mas não é mais usado
     */
    calculateMagoPreparedLevels(preparedSpellIds) {
        let total = 0;
        preparedSpellIds.forEach(spellId => {
            const spell = MagoSpellsHelper.getSpellById(spellId);
            if (spell && spell.type !== 'truque') {
                total += spell.level;
            }
        });
        return total;
    },
    
    /**
     * Atualiza o display do limite de feitiços do Mago
     * Limite: nível + 2 feitiços (quantidade) + bônus extras
     */
    updateMagoLimitDisplay(characterLevel, preparedSpells, bonusSlots = 0, usedBonusSlots = 0) {
        const display = document.getElementById('grimoire-limit-display');
        if (!display) return;
        
        const limit = this.getMagoSpellLimit(characterLevel); // nível + 2
        const used = preparedSpells.length;
        const remaining = limit - used;
        
        let bonusText = '';
        if (bonusSlots > 0) {
            bonusText = `<span class="grimoire-limit-bonus">+ ${usedBonusSlots}/${bonusSlots} bônus</span>`;
        }
        
        display.innerHTML = `
            <span class="grimoire-limit-label">Feitiços Preparados:</span>
            <span class="grimoire-limit-value ${remaining <= 0 ? 'at-limit' : ''}">
                ${used}/${limit}
            </span>
            ${bonusText}
            <span class="grimoire-limit-remaining">(${remaining} restante${remaining !== 1 ? 's' : ''})</span>
        `;
    },
    
    /**
     * Mostra aviso de limite de feitiços do Mago excedido
     */
    showMagoLimitWarning(current, limit) {
        const warning = document.createElement('div');
        warning.className = 'grimoire-warning-toast';
        warning.innerHTML = `
            <span class="grimoire-warning-icon">⚠️</span>
            <span>Limite atingido! Você já tem ${current}/${limit} feitiços preparados.</span>
        `;
        
        document.body.appendChild(warning);
        
        setTimeout(() => {
            warning.classList.add('hiding');
            setTimeout(() => warning.remove(), 300);
        }, 3000);
    },
    
    /**
     * Mostra aviso de limite de feitiços bônus excedido
     */
    showBonusLimitWarning(current, limit) {
        const warning = document.createElement('div');
        warning.className = 'grimoire-warning-toast';
        warning.innerHTML = `
            <span class="grimoire-warning-icon">⚠️</span>
            <span>Limite de bônus atingido! Você só pode preparar ${limit} feitiço${limit !== 1 ? 's' : ''} extra${limit !== 1 ? 's' : ''}.</span>
        `;
        
        document.body.appendChild(warning);
        
        setTimeout(() => {
            warning.classList.add('hiding');
            setTimeout(() => warning.remove(), 300);
        }, 3000);
    },
    
    /**
     * Atualiza os avisos de feitiços contínuos do Mago
     */
    updateMagoOngoingWarnings() {
        const container = document.getElementById('grimoire-warnings');
        if (!container) return;
        
        const character = Store.get('character');
        const activeSpells = character?.activeOngoingSpells || [];
        
        container.innerHTML = '';
        
        if (activeSpells.length > 0) {
            const penaltyCount = activeSpells.length;
            
            const warningBox = document.createElement('div');
            warningBox.className = 'grimoire-ongoing-warning';
            warningBox.innerHTML = `
                <div class="grimoire-warning-header">
                    <span class="grimoire-warning-icon">⚠️</span>
                    <strong>Feitiços Contínuos Ativos: ${penaltyCount}</strong>
                </div>
                <p class="grimoire-warning-text">
                    Você possui feitiços contínuos ativos e recebe <strong>-${penaltyCount}</strong> para Conjurar Feitiços.
                </p>
                <div class="grimoire-active-spells">
                    ${activeSpells.map(spellId => {
                        const spell = MagoSpellsHelper.getSpellById(spellId);
                        return spell ? `<span class="grimoire-active-spell-tag">${spell.name}</span>` : '';
                    }).join('')}
                </div>
            `;
            container.appendChild(warningBox);
        }
    },
    
    /**
     * Renderiza o grimório do Clérigo
     * Feitiços de bônus (O Escolhido/Abençoado) são extras e não contam para o limite
     */
    renderClerigoGrimoire(characterData) {
        const content = document.createElement('div');
        content.className = 'grimoire-content';
        
        const character = characterData || Store.get('character');
        const level = character?.level || 1;
        const preparedSpells = character?.preparedSpells || [];
        const bonusPreparedSpells = character?.bonusPreparedSpells || [];
        
        // Slots de bônus disponíveis (O Escolhido/Abençoado) e círculos salvos
        const bonusSlots = this.getBonusSpellSlots(character);
        const usedBonusSlots = bonusPreparedSpells.length;
        const bonusCircles = this.getBonusSpellCircles(character); // Círculos salvos
        
        // Atualizar display do limite
        this.updateLimitDisplay(level, preparedSpells, bonusSlots, usedBonusSlots);
        
        // === ORAÇÕES ===
        const oracoesSection = this.renderOracoesSection();
        content.appendChild(oracoesSection);
        
        // === FEITIÇOS POR NÍVEL ===
        const spellLevels = [
            { key: 'nivel1', title: 'Feitiços de 1º Nível', minLevel: 1, spellLevel: 1 },
            { key: 'nivel3', title: 'Feitiços de 3º Nível', minLevel: 3, spellLevel: 3 },
            { key: 'nivel5', title: 'Feitiços de 5º Nível', minLevel: 5, spellLevel: 5 },
            { key: 'nivel7', title: 'Feitiços de 7º Nível', minLevel: 7, spellLevel: 7 },
            { key: 'nivel9', title: 'Feitiços de 9º Nível', minLevel: 9, spellLevel: 9 }
        ];
        
        spellLevels.forEach(levelInfo => {
            const spells = CLERIGO_SPELLS[levelInfo.key];
            if (spells && spells.length > 0) {
                // Conta quantos slots de bônus estão disponíveis para este círculo
                const bonusSlotsForThisCircle = bonusCircles.filter(c => c === levelInfo.spellLevel).length;
                
                // Conta quantos feitiços de bônus deste círculo já estão preparados
                const usedBonusSlotsForThisCircle = bonusPreparedSpells.filter(id => {
                    const spell = ClerigoSpellsHelper.getSpellById(id);
                    return spell && spell.level === levelInfo.spellLevel;
                }).length;
                
                // É seção APENAS de bônus se: está acima do nível E tem slots de bônus para este círculo
                const isBonusOnlySection = levelInfo.spellLevel > level && bonusSlotsForThisCircle > 0;
                
                // Seção tem bônus disponível: tem slots de bônus para este círculo (mesmo se já desbloqueada)
                const hasBonusSlots = bonusSlotsForThisCircle > 0;
                
                // É bloqueada se: está acima do nível E não é seção de bônus
                const isLocked = levelInfo.spellLevel > level && !isBonusOnlySection;
                
                // Não renderiza seções bloqueadas que estão muito acima do nível
                if (isLocked && levelInfo.spellLevel > level + 2) {
                    return;
                }
                
                const section = this.renderSpellSection({
                    title: levelInfo.title,
                    spells: spells,
                    spellLevel: levelInfo.spellLevel,
                    characterLevel: level,
                    preparedSpells: preparedSpells,
                    bonusPreparedSpells: bonusPreparedSpells,
                    isLocked: isLocked,
                    isBonusOnlySection: isBonusOnlySection,
                    hasBonusSlots: hasBonusSlots,
                    bonusSlots: bonusSlotsForThisCircle,
                    usedBonusSlots: usedBonusSlotsForThisCircle
                });
                content.appendChild(section);
            }
        });
        
        return content;
    },
    
    /**
     * Renderiza a seção de Orações (com accordion)
     */
    renderOracoesSection() {
        const sectionKey = 'oracoes';
        const isOpen = this.openAccordions.has(sectionKey);
        
        const section = document.createElement('section');
        section.className = 'grimoire-section grimoire-section-oracoes grimoire-accordion';
        
        if (isOpen) {
            section.classList.add('grimoire-accordion-open');
        }
        
        // Header da seção (clicável)
        const header = document.createElement('div');
        header.className = 'grimoire-section-header grimoire-accordion-header';
        header.setAttribute('data-accordion-key', sectionKey);
        
        const titleWrapper = document.createElement('div');
        titleWrapper.className = 'grimoire-accordion-title-wrapper';
        
        const toggleIcon = document.createElement('span');
        toggleIcon.className = 'grimoire-accordion-icon';
        toggleIcon.textContent = isOpen ? '▼' : '▶';
        titleWrapper.appendChild(toggleIcon);
        
        const titleEl = document.createElement('h3');
        titleEl.className = 'grimoire-section-title';
        titleEl.textContent = 'Orações';
        titleWrapper.appendChild(titleEl);
        
        header.appendChild(titleWrapper);
        
        const badge = document.createElement('span');
        badge.className = 'grimoire-section-badge grimoire-section-badge-always';
        badge.textContent = 'Sempre Disponíveis';
        header.appendChild(badge);
        
        header.addEventListener('click', () => {
            this.toggleAccordion(sectionKey, section);
        });
        
        section.appendChild(header);
        
        // Conteúdo do accordion
        const content = document.createElement('div');
        content.className = 'grimoire-accordion-content';
        
        // Aviso informativo
        const info = document.createElement('div');
        info.className = 'grimoire-info-box';
        info.innerHTML = `
            <span class="grimoire-info-icon">ℹ️</span>
            <p>${CLERIGO_SPELLS.oracoesInfo}</p>
        `;
        content.appendChild(info);
        
        // Grid de orações
        const grid = document.createElement('div');
        grid.className = 'grimoire-spell-grid';
        
        CLERIGO_SPELLS.oracoes.forEach(spell => {
            const card = this.renderSpellCard(spell, {
                isOracao: true,
                isPrepared: true // Orações sempre estão preparadas
            });
            grid.appendChild(card);
        });
        
        content.appendChild(grid);
        section.appendChild(content);
        
        return section;
    },
    
    /**
     * Renderiza uma seção de feitiços por nível do Clérigo (com accordion)
     * Seções de bônus permitem preparar feitiços extras que não contam para o limite
     */
    renderSpellSection({ title, spells, spellLevel, characterLevel, preparedSpells, bonusPreparedSpells, isLocked, isBonusOnlySection, hasBonusSlots, bonusSlots, usedBonusSlots }) {
        const sectionKey = `clerigo_nivel${spellLevel}`;
        const isOpen = this.openAccordions.has(sectionKey);
        
        const section = document.createElement('section');
        section.className = `grimoire-section grimoire-section-level${spellLevel} grimoire-accordion`;
        
        if (isLocked) {
            section.classList.add('grimoire-section-locked');
        }
        
        if (isBonusOnlySection) {
            section.classList.add('grimoire-section-bonus-unlocked');
        }
        
        if (isOpen) {
            section.classList.add('grimoire-accordion-open');
        }
        
        // Header da seção (clicável)
        const header = document.createElement('div');
        header.className = 'grimoire-section-header grimoire-accordion-header';
        header.setAttribute('data-accordion-key', sectionKey);
        
        const titleWrapper = document.createElement('div');
        titleWrapper.className = 'grimoire-accordion-title-wrapper';
        
        const toggleIcon = document.createElement('span');
        toggleIcon.className = 'grimoire-accordion-icon';
        toggleIcon.textContent = isOpen ? '▼' : '▶';
        titleWrapper.appendChild(toggleIcon);
        
        const titleEl = document.createElement('h3');
        titleEl.className = 'grimoire-section-title';
        titleEl.textContent = title;
        titleWrapper.appendChild(titleEl);
        
        header.appendChild(titleWrapper);
        
        if (isLocked) {
            const lockBadge = document.createElement('span');
            lockBadge.className = 'grimoire-section-badge grimoire-section-badge-locked';
            lockBadge.textContent = `Requer Nível ${spellLevel}`;
            header.appendChild(lockBadge);
        } else if (isBonusOnlySection) {
            // Seção apenas de bônus (ainda não desbloqueada naturalmente)
            const bonusBadge = document.createElement('span');
            bonusBadge.className = 'grimoire-section-badge grimoire-section-badge-bonus';
            const availableSlots = bonusSlots - usedBonusSlots;
            bonusBadge.innerHTML = `✨ Bônus (${availableSlots}/${bonusSlots} slots)`;
            header.appendChild(bonusBadge);
        } else {
            // Seção normal (desbloqueada por nível)
            const countBadge = document.createElement('span');
            countBadge.className = 'grimoire-section-badge';
            countBadge.textContent = `${spells.length} feitiços`;
            header.appendChild(countBadge);
            
            // Se tem slots de bônus para esta seção, mostrar também
            if (hasBonusSlots && bonusSlots > 0) {
                const bonusBadge = document.createElement('span');
                bonusBadge.className = 'grimoire-section-badge grimoire-section-badge-bonus';
                const availableSlots = bonusSlots - usedBonusSlots;
                bonusBadge.innerHTML = `✨ +${usedBonusSlots}/${bonusSlots} bônus`;
                header.appendChild(bonusBadge);
            }
        }
        
        // Evento de clique no header
        header.addEventListener('click', () => {
            this.toggleAccordion(sectionKey, section);
        });
        
        section.appendChild(header);
        
        // Conteúdo do accordion (grid de feitiços)
        const content = document.createElement('div');
        content.className = 'grimoire-accordion-content';
        
        // Info para seção de bônus
        if (isBonusOnlySection) {
            const bonusInfo = document.createElement('div');
            bonusInfo.className = 'grimoire-bonus-info';
            bonusInfo.innerHTML = `
                <span class="bonus-icon">✨</span>
                <span>Feitiços preparados aqui são <strong>extras</strong> e não contam para seu limite normal.</span>
            `;
            content.appendChild(bonusInfo);
        }
        
        const grid = document.createElement('div');
        grid.className = 'grimoire-spell-grid';
        
        const character = Store.get('character');
        const activeOngoingSpells = character?.activeOngoingSpells || [];
        
        spells.forEach(spell => {
            const isPrepared = preparedSpells.includes(spell.id);
            const isPreparedAsBonus = bonusPreparedSpells.includes(spell.id);
            const isActive = activeOngoingSpells.includes(spell.id);
            
            // Pode preparar se: seção normal desbloqueada OU seção de bônus com slots disponíveis
            const canPrepare = !isLocked && (!isBonusOnlySection || usedBonusSlots < bonusSlots || isPreparedAsBonus);
            
            const card = this.renderSpellCard(spell, {
                isOracao: false,
                isPrepared: isPrepared || isPreparedAsBonus,
                isPreparedAsBonus: isPreparedAsBonus,
                isActive: isActive,
                isLocked: isLocked,
                canPrepare: canPrepare,
                characterLevel: characterLevel,
                isBonusOnlySection: isBonusOnlySection
            });
            grid.appendChild(card);
        });
        
        content.appendChild(grid);
        section.appendChild(content);
        
        return section;
    },
    
    /**
     * Renderiza um card de feitiço do Clérigo
     */
    renderSpellCard(spell, options = {}) {
        const {
            isOracao = false,
            isPrepared = false,
            isPreparedAsBonus = false,
            isActive = false,
            isLocked = false,
            canPrepare = true,
            isBonusOnlySection = false
        } = options;
        
        const card = document.createElement('div');
        card.className = `grimoire-spell-card ${isPrepared ? 'prepared' : ''} ${isLocked ? 'locked' : ''} ${isActive ? 'active-ongoing' : ''} ${isPreparedAsBonus ? 'bonus-spell' : ''}`;
        card.setAttribute('data-spell-id', spell.id);
        card.setAttribute('data-spell-level', spell.level);
        if (isBonusOnlySection) {
            card.setAttribute('data-bonus-section', 'true');
        }
        
        // Header do card
        const header = document.createElement('div');
        header.className = 'grimoire-spell-header';
        
        // Badge de bônus se preparado como bônus
        if (isPreparedAsBonus) {
            const bonusBadge = document.createElement('div');
            bonusBadge.className = 'grimoire-bonus-badge';
            bonusBadge.innerHTML = `<span class="bonus-icon">✨</span> Feitiço Bônus (não conta para limite)`;
            header.appendChild(bonusBadge);
        }
        
        // Controles do feitiço
        const controls = document.createElement('div');
        controls.className = 'grimoire-spell-controls';
        
        // Checkbox preparado (apenas para feitiços, não orações)
        if (!isOracao) {
            const preparedControl = document.createElement('div');
            preparedControl.className = 'grimoire-control-group';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'grimoire-spell-checkbox';
            checkbox.id = `spell-${spell.id}`;
            checkbox.checked = isPrepared;
            checkbox.disabled = isLocked || !canPrepare;
            checkbox.addEventListener('change', (e) => {
                this.handleSpellToggle(spell, e.target.checked, card);
            });
            
            const preparedLabel = document.createElement('label');
            preparedLabel.htmlFor = `spell-${spell.id}`;
            preparedLabel.className = 'grimoire-control-label';
            preparedLabel.innerHTML = '<span class="control-icon">✔️</span> Preparado';
            
            preparedControl.appendChild(checkbox);
            preparedControl.appendChild(preparedLabel);
            controls.appendChild(preparedControl);
        }
        
        // Botão Ativo (apenas para feitiços contínuos e preparados)
        if (spell.ongoing && !isOracao) {
            const activeControl = document.createElement('div');
            activeControl.className = 'grimoire-control-group grimoire-control-active';
            
            const activeCheckbox = document.createElement('input');
            activeCheckbox.type = 'checkbox';
            activeCheckbox.className = 'grimoire-active-checkbox';
            activeCheckbox.id = `spell-active-${spell.id}`;
            activeCheckbox.checked = isActive;
            activeCheckbox.disabled = !isPrepared;
            activeCheckbox.addEventListener('change', (e) => {
                this.handleActiveToggle(spell, e.target.checked, card);
            });
            
            const activeLabel = document.createElement('label');
            activeLabel.htmlFor = `spell-active-${spell.id}`;
            activeLabel.className = 'grimoire-control-label grimoire-control-label-active';
            activeLabel.innerHTML = '<span class="control-icon">🔥</span> Ativo';
            
            activeControl.appendChild(activeCheckbox);
            activeControl.appendChild(activeLabel);
            controls.appendChild(activeControl);
        }
        
        header.appendChild(controls);
        
        // Nome do feitiço
        const name = document.createElement('span');
        name.className = 'grimoire-spell-name';
        name.textContent = spell.name;
        header.appendChild(name);
        
        // Badges
        const badges = document.createElement('div');
        badges.className = 'grimoire-spell-badges';
        
        // Badge de nível
        const levelBadge = document.createElement('span');
        levelBadge.className = 'grimoire-spell-badge grimoire-spell-badge-level';
        levelBadge.textContent = isOracao ? 'Oração' : `Nível ${spell.level}`;
        badges.appendChild(levelBadge);
        
        // Badge de Contínuo
        if (spell.ongoing) {
            const ongoingBadge = document.createElement('span');
            ongoingBadge.className = 'grimoire-spell-badge grimoire-spell-badge-ongoing';
            ongoingBadge.textContent = 'Contínuo';
            badges.appendChild(ongoingBadge);
        }
        
        header.appendChild(badges);
        card.appendChild(header);
        
        // Descrição
        const description = document.createElement('div');
        description.className = 'grimoire-spell-description';
        description.innerHTML = this.formatSpellText(spell.description);
        card.appendChild(description);
        
        return card;
    },
    
    /**
     * Formata o texto do feitiço (campos editáveis, avisos de penalidade, etc.)
     */
    formatSpellText(text) {
        // Substituir __________ por campos editáveis
        let formatted = text.replace(/__________/g, '<input type="text" class="grimoire-inline-input" placeholder="...">');
        
        // Destacar avisos de penalidade
        formatted = formatted.replace(
            /(Enquanto este feitiço estiver ativo, você recebe -1 para conjurar feitiços\.)/gi,
            '<span class="grimoire-penalty-warning">⚠️ $1</span>'
        );
        
        // Destacar outros avisos importantes
        formatted = formatted.replace(
            /(não é possível|não poderá|não conseguirá)/gi,
            '<strong class="grimoire-warning-text">$1</strong>'
        );
        
        // Formatar listas se houver
        // Detectar padrões de lista
        formatted = formatted.replace(/• ([^\n]+)/g, '<li>$1</li>');
        if (formatted.includes('<li>')) {
            formatted = formatted.replace(/(<li>.*<\/li>)/gs, '<ul class="grimoire-spell-list">$1</ul>');
        }
        
        return formatted;
    },
    
    /**
     * Manipula toggle de feitiço preparado (Clérigo)
     * Limite normal: nível + 1 em níveis de feitiços
     * Feitiços de bônus (O Escolhido/Abençoado) são extras e não contam para o limite
     */
    handleSpellToggle(spell, isPrepared, cardElement) {
        const character = Store.get('character');
        if (!character) return;
        
        const isBonusSection = cardElement.getAttribute('data-bonus-section') === 'true';
        let preparedSpells = [...(character.preparedSpells || [])];
        let bonusPreparedSpells = [...(character.bonusPreparedSpells || [])];
        const level = character.level || 1;
        const spellLimit = level + 1;
        const bonusSlots = this.getBonusSpellSlots(character);
        
        // O feitiço conta seu nível real
        const spellLevel = spell.level;
        
        // Verifica slots de bônus disponíveis para este círculo
        const bonusSlotsForCircle = this.getBonusSlotsForCircle(character, spellLevel);
        
        if (isPrepared) {
            if (isBonusSection) {
                // Feitiço de seção de bônus (ainda não desbloqueada por nível)
                if (bonusSlotsForCircle.available <= 0) {
                    // Reverter checkbox
                    const checkbox = cardElement.querySelector('.grimoire-spell-checkbox');
                    if (checkbox) checkbox.checked = false;
                    
                    this.showBonusLimitWarning(bonusSlotsForCircle.used, bonusSlotsForCircle.total);
                    return;
                }
                
                bonusPreparedSpells.push(spell.id);
                cardElement.classList.add('prepared', 'bonus-spell');
            } else {
                // Seção normal - verifica limite de níveis e slots de bônus
                const currentTotal = this.calculatePreparedLevels(preparedSpells);
                const newTotal = currentTotal + spellLevel;
                
                if (newTotal > spellLimit) {
                    // Limite normal atingido, tenta usar slot de bônus se disponível
                    if (bonusSlotsForCircle.available > 0) {
                        // Usa slot de bônus para este círculo
                        bonusPreparedSpells.push(spell.id);
                        cardElement.classList.add('prepared', 'bonus-spell');
                    } else {
                        // Reverter checkbox
                        const checkbox = cardElement.querySelector('.grimoire-spell-checkbox');
                        if (checkbox) checkbox.checked = false;
                        
                        // Mostrar alerta
                        this.showLimitWarning(currentTotal, spellLimit, spellLevel);
                        return;
                    }
                } else {
                    // Ainda tem espaço no limite normal
                    preparedSpells.push(spell.id);
                    cardElement.classList.add('prepared');
                }
            }
            
            // Habilitar checkbox de ativo se for contínuo
            const activeCheckbox = cardElement.querySelector('.grimoire-active-checkbox');
            if (activeCheckbox) activeCheckbox.disabled = false;
        } else {
            // Desprepararar - verifica se é bônus ou normal
            if (bonusPreparedSpells.includes(spell.id)) {
                bonusPreparedSpells = bonusPreparedSpells.filter(id => id !== spell.id);
                cardElement.classList.remove('bonus-spell');
            } else {
                preparedSpells = preparedSpells.filter(id => id !== spell.id);
            }
            cardElement.classList.remove('prepared');
            
            // Se for contínuo e estava ativo, desativar
            if (spell.ongoing) {
                let activeSpells = [...(character.activeOngoingSpells || [])];
                if (activeSpells.includes(spell.id)) {
                    activeSpells = activeSpells.filter(id => id !== spell.id);
                    Store.setCharacterProperty('activeOngoingSpells', activeSpells);
                    cardElement.classList.remove('active-ongoing');
                }
                
                // Desabilitar checkbox de ativo
                const activeCheckbox = cardElement.querySelector('.grimoire-active-checkbox');
                if (activeCheckbox) {
                    activeCheckbox.checked = false;
                    activeCheckbox.disabled = true;
                }
            }
        }
        
        Store.setCharacterProperty('preparedSpells', preparedSpells);
        Store.setCharacterProperty('bonusPreparedSpells', bonusPreparedSpells);
        this.updateLimitDisplay(level, preparedSpells, bonusSlots, bonusPreparedSpells.length);
        this.updateOngoingWarnings();
        
        // Dispara evento
        document.dispatchEvent(new CustomEvent('spellToggled', {
            detail: { spellId: spell.id, isPrepared, isBonus: isBonusSection }
        }));
    },
    
    /**
     * Manipula toggle de feitiço ativo (contínuos)
     */
    handleActiveToggle(spell, isActive, cardElement) {
        const character = Store.get('character');
        if (!character) return;
        
        let activeSpells = [...(character.activeOngoingSpells || [])];
        
        if (isActive) {
            activeSpells.push(spell.id);
            cardElement.classList.add('active-ongoing');
        } else {
            activeSpells = activeSpells.filter(id => id !== spell.id);
            cardElement.classList.remove('active-ongoing');
        }
        
        Store.setCharacterProperty('activeOngoingSpells', activeSpells);
        this.updateOngoingWarnings();
        
        // Dispara evento
        document.dispatchEvent(new CustomEvent('ongoingSpellToggled', {
            detail: { spellId: spell.id, isActive, activeCount: activeSpells.length }
        }));
    },
    
    /**
     * Calcula total de níveis dos feitiços preparados (Clérigo)
     * Usa o nível real do feitiço, sem redução
     */
    calculatePreparedLevels(preparedSpellIds) {
        let total = 0;
        preparedSpellIds.forEach(spellId => {
            // Tenta buscar em Clérigo e Mago
            let spell = ClerigoSpellsHelper.getSpellById(spellId);
            if (!spell && typeof MagoSpellsHelper !== 'undefined') {
                spell = MagoSpellsHelper.getSpellById(spellId);
            }
            if (spell && spell.type !== 'oracao') {
                // Usa nível real do feitiço
                total += spell.level;
            }
        });
        return total;
    },
    
    /**
     * Atualiza o display do limite de feitiços do Clérigo
     * Limite: nível + 1 em níveis de feitiços + bônus extras
     */
    updateLimitDisplay(characterLevel, preparedSpells, bonusSlots = 0, usedBonusSlots = 0) {
        const display = document.getElementById('grimoire-limit-display');
        if (!display) return;
        
        const limit = characterLevel + 1;
        const used = this.calculatePreparedLevels(preparedSpells);
        const remaining = limit - used;
        
        let bonusText = '';
        if (bonusSlots > 0) {
            bonusText = `<span class="grimoire-limit-bonus">+ ${usedBonusSlots}/${bonusSlots} bônus</span>`;
        }
        
        display.innerHTML = `
            <span class="grimoire-limit-label">Limite de Feitiços:</span>
            <span class="grimoire-limit-value ${remaining <= 0 ? 'at-limit' : ''}">
                ${used}/${limit} níveis
            </span>
            ${bonusText}
            <span class="grimoire-limit-remaining">(${remaining} restante${remaining !== 1 ? 's' : ''})</span>
        `;
    },
    
    /**
     * Mostra aviso de limite excedido
     */
    showLimitWarning(currentTotal, limit, spellLevel) {
        // Criar notificação temporária
        const warning = document.createElement('div');
        warning.className = 'grimoire-warning-toast';
        warning.innerHTML = `
            <span class="grimoire-warning-icon">⚠️</span>
            <span>Limite excedido! Você tem ${currentTotal}/${limit} níveis usados. Este feitiço precisa de ${spellLevel} nível(is).</span>
        `;
        
        document.body.appendChild(warning);
        
        // Remover após 3 segundos
        setTimeout(() => {
            warning.classList.add('hiding');
            setTimeout(() => warning.remove(), 300);
        }, 3000);
    },
    
    /**
     * Renderiza o grimório de clérigo para outras classes (Paladino/Ranger com Favor Divino)
     * @param {Object} character - Dados do personagem
     * @param {number} clericLevel - Nível efetivo de clérigo
     * @returns {HTMLElement}
     */
    renderClericGrimoireForOtherClass(character, clericLevel) {
        const container = document.createElement('div');
        container.className = 'grimoire-container grimoire-container-cleric-granted';
        container.setAttribute('data-class', 'clerigo-granted');
        
        // Header do Grimório com indicador de nível de clérigo
        const header = this.renderClericGrantedHeader(character, clericLevel);
        container.appendChild(header);
        
        // Avisos de feitiços contínuos ativos
        const warningsSection = this.renderClericGrantedWarnings(character);
        container.appendChild(warningsSection);
        
        // Conteúdo do grimório de clérigo
        const content = this.renderClericGrantedContent(character, clericLevel);
        container.appendChild(content);
        
        return container;
    },
    
    /**
     * Renderiza o header do grimório concedido por Favor Divino
     */
    renderClericGrantedHeader(character, clericLevel) {
        const header = document.createElement('header');
        header.className = 'grimoire-header grimoire-header-cleric-granted';
        
        const titleRow = document.createElement('div');
        titleRow.className = 'grimoire-title-row';
        
        const title = document.createElement('h2');
        title.className = 'grimoire-title';
        title.innerHTML = '<span class="grimoire-icon">✝️</span> Grimório Divino';
        titleRow.appendChild(title);
        
        // Indicador de nível de clérigo
        const levelIndicator = document.createElement('div');
        levelIndicator.className = 'cleric-level-indicator';
        levelIndicator.innerHTML = `
            <div class="cleric-level-circles">
                ${Array.from({length: 10}, (_, i) => {
                    const level = i + 1;
                    const isActive = level <= clericLevel;
                    return `<span class="cleric-level-circle ${isActive ? 'active' : ''}" title="Nível ${level}">${level}</span>`;
                }).join('')}
            </div>
            <span class="cleric-level-text">Nível de Clérigo: <strong>${clericLevel}</strong></span>
        `;
        titleRow.appendChild(levelIndicator);
        
        header.appendChild(titleRow);
        
        // Informação de origem
        const sourceInfo = document.createElement('div');
        sourceInfo.className = 'grimoire-source-info';
        const sourceMoveId = character.classId === 'paladino' ? 'Favor Divino' : 'Deuses em Meio à Desolação';
        sourceInfo.innerHTML = `
            <span class="grimoire-source-badge">
                <span class="source-icon">⚔️</span>
                Concedido por: ${sourceMoveId}
            </span>
        `;
        header.appendChild(sourceInfo);
        
        // Informação de limite de feitiços (usando nível de clérigo)
        const limitInfo = document.createElement('div');
        limitInfo.className = 'grimoire-limit-info';
        limitInfo.id = 'grimoire-limit-display-cleric-granted';
        header.appendChild(limitInfo);
        
        return header;
    },
    
    /**
     * Renderiza avisos de feitiços contínuos para o grimório concedido
     */
    renderClericGrantedWarnings(character) {
        const container = document.createElement('div');
        container.className = 'grimoire-warnings-container';
        container.id = 'grimoire-warnings-cleric-granted';
        
        const activeSpells = character?.activeClericOngoingSpells || [];
        
        if (activeSpells.length > 0) {
            const penaltyCount = activeSpells.length;
            
            const warningBox = document.createElement('div');
            warningBox.className = 'grimoire-ongoing-warning';
            warningBox.innerHTML = `
                <div class="grimoire-warning-header">
                    <span class="grimoire-warning-icon">⚠️</span>
                    <strong>Feitiços Contínuos Ativos: ${penaltyCount}</strong>
                </div>
                <p class="grimoire-warning-text">
                    Você possui feitiços contínuos ativos e recebe <strong>-${penaltyCount}</strong> para Conjurar Feitiços.
                </p>
                <div class="grimoire-active-spells">
                    ${activeSpells.map(spellId => {
                        const spell = ClerigoSpellsHelper.getSpellById(spellId);
                        return spell ? `<span class="grimoire-active-spell-tag">${spell.name}</span>` : '';
                    }).join('')}
                </div>
            `;
            container.appendChild(warningBox);
        }
        
        return container;
    },
    
    /**
     * Renderiza o conteúdo do grimório de clérigo concedido
     */
    renderClericGrantedContent(character, clericLevel) {
        const content = document.createElement('div');
        content.className = 'grimoire-content';
        
        const preparedSpells = character?.clericPreparedSpells || [];
        
        // Atualiza display do limite usando nível de clérigo
        setTimeout(() => {
            this.updateClericGrantedLimitDisplay(clericLevel, preparedSpells);
        }, 0);
        
        // === ORAÇÕES ===
        const oracoesSection = this.renderOracoesSection();
        content.appendChild(oracoesSection);
        
        // === FEITIÇOS POR NÍVEL ===
        const spellLevels = [
            { key: 'nivel1', title: 'Feitiços de 1º Nível', minLevel: 1, spellLevel: 1 },
            { key: 'nivel3', title: 'Feitiços de 3º Nível', minLevel: 3, spellLevel: 3 },
            { key: 'nivel5', title: 'Feitiços de 5º Nível', minLevel: 5, spellLevel: 5 },
            { key: 'nivel7', title: 'Feitiços de 7º Nível', minLevel: 7, spellLevel: 7 },
            { key: 'nivel9', title: 'Feitiços de 9º Nível', minLevel: 9, spellLevel: 9 }
        ];
        
        spellLevels.forEach(levelInfo => {
            const spells = CLERIGO_SPELLS[levelInfo.key];
            if (spells && spells.length > 0) {
                const section = this.renderClericGrantedSpellSection({
                    title: levelInfo.title,
                    spells: spells,
                    spellLevel: levelInfo.spellLevel,
                    clericLevel: clericLevel,
                    preparedSpells: preparedSpells,
                    isLocked: clericLevel < levelInfo.minLevel
                });
                content.appendChild(section);
            }
        });
        
        return content;
    },
    
    /**
     * Renderiza uma seção de feitiços para grimório concedido (com accordion)
     */
    renderClericGrantedSpellSection({ title, spells, spellLevel, clericLevel, preparedSpells, isLocked }) {
        const sectionKey = `granted_nivel${spellLevel}`;
        const isOpen = this.openAccordions.has(sectionKey);
        
        const section = document.createElement('section');
        section.className = `grimoire-section grimoire-section-level${spellLevel} grimoire-accordion`;
        
        if (isOpen) {
            section.classList.add('grimoire-accordion-open');
        }
        
        if (isLocked) {
            section.classList.add('grimoire-section-locked');
        }
        
        // Header da seção (clicável)
        const header = document.createElement('div');
        header.className = 'grimoire-section-header grimoire-accordion-header';
        header.setAttribute('data-accordion-key', sectionKey);
        
        const titleWrapper = document.createElement('div');
        titleWrapper.className = 'grimoire-accordion-title-wrapper';
        
        const toggleIcon = document.createElement('span');
        toggleIcon.className = 'grimoire-accordion-icon';
        toggleIcon.textContent = isOpen ? '▼' : '▶';
        titleWrapper.appendChild(toggleIcon);
        
        const titleEl = document.createElement('h3');
        titleEl.className = 'grimoire-section-title';
        titleEl.textContent = title;
        titleWrapper.appendChild(titleEl);
        
        header.appendChild(titleWrapper);
        
        if (isLocked) {
            const lockBadge = document.createElement('span');
            lockBadge.className = 'grimoire-section-badge grimoire-section-badge-locked';
            lockBadge.textContent = `Requer Nível de Clérigo ${spellLevel}`;
            header.appendChild(lockBadge);
        } else {
            const countBadge = document.createElement('span');
            countBadge.className = 'grimoire-section-badge';
            countBadge.textContent = `${spells.length} feitiços`;
            header.appendChild(countBadge);
        }
        
        header.addEventListener('click', () => {
            this.toggleAccordion(sectionKey, section);
        });
        
        section.appendChild(header);
        
        // Conteúdo do accordion
        const content = document.createElement('div');
        content.className = 'grimoire-accordion-content';
        
        // Grid de feitiços
        const grid = document.createElement('div');
        grid.className = 'grimoire-spell-grid';
        
        const character = Store.get('character');
        const activeOngoingSpells = character?.activeClericOngoingSpells || [];
        
        spells.forEach(spell => {
            const isPrepared = preparedSpells.includes(spell.id);
            const isActive = activeOngoingSpells.includes(spell.id);
            const canPrepare = !isLocked && spellLevel <= clericLevel;
            
            const card = this.renderClericGrantedSpellCard(spell, {
                isPrepared: isPrepared,
                isActive: isActive,
                isLocked: isLocked,
                canPrepare: canPrepare,
                clericLevel: clericLevel
            });
            grid.appendChild(card);
        });
        
        content.appendChild(grid);
        section.appendChild(content);
        
        return section;
    },
    
    /**
     * Renderiza um card de feitiço para grimório concedido
     */
    renderClericGrantedSpellCard(spell, options = {}) {
        const {
            isPrepared = false,
            isActive = false,
            isLocked = false,
            canPrepare = true,
            clericLevel = 1
        } = options;
        
        const card = document.createElement('div');
        card.className = `grimoire-spell-card ${isPrepared ? 'prepared' : ''} ${isLocked ? 'locked' : ''} ${isActive ? 'active-ongoing' : ''}`;
        card.setAttribute('data-spell-id', spell.id);
        card.setAttribute('data-spell-level', spell.level);
        card.setAttribute('data-spell-type', 'cleric-granted');
        
        // Header do card
        const header = document.createElement('div');
        header.className = 'grimoire-spell-header';
        
        // Controles do feitiço
        const controls = document.createElement('div');
        controls.className = 'grimoire-spell-controls';
        
        // Checkbox preparado
        const preparedControl = document.createElement('div');
        preparedControl.className = 'grimoire-control-group';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'grimoire-spell-checkbox';
        checkbox.id = `cleric-spell-${spell.id}`;
        checkbox.checked = isPrepared;
        checkbox.disabled = isLocked || !canPrepare;
        
        checkbox.addEventListener('change', () => {
            this.handleClericGrantedSpellPrepare(spell.id, spell.level, checkbox.checked, clericLevel);
        });
        
        preparedControl.appendChild(checkbox);
        
        const label = document.createElement('label');
        label.htmlFor = `cleric-spell-${spell.id}`;
        label.className = 'grimoire-checkbox-label';
        label.textContent = isPrepared ? 'Preparado' : 'Preparar';
        preparedControl.appendChild(label);
        
        controls.appendChild(preparedControl);
        
        // Toggle de feitiço contínuo ativo
        if (spell.ongoing && isPrepared) {
            const ongoingControl = document.createElement('div');
            ongoingControl.className = 'grimoire-control-group grimoire-ongoing-control';
            
            const ongoingCheckbox = document.createElement('input');
            ongoingCheckbox.type = 'checkbox';
            ongoingCheckbox.className = 'grimoire-ongoing-checkbox';
            ongoingCheckbox.id = `cleric-spell-ongoing-${spell.id}`;
            ongoingCheckbox.checked = isActive;
            
            ongoingCheckbox.addEventListener('change', () => {
                this.handleClericGrantedOngoingToggle(spell.id, ongoingCheckbox.checked);
            });
            
            ongoingControl.appendChild(ongoingCheckbox);
            
            const ongoingLabel = document.createElement('label');
            ongoingLabel.htmlFor = `cleric-spell-ongoing-${spell.id}`;
            ongoingLabel.className = 'grimoire-ongoing-label';
            ongoingLabel.textContent = 'Ativo';
            ongoingControl.appendChild(ongoingLabel);
            
            controls.appendChild(ongoingControl);
        }
        
        header.appendChild(controls);
        
        // Nome e nível
        const titleGroup = document.createElement('div');
        titleGroup.className = 'grimoire-spell-title-group';
        
        const name = document.createElement('h4');
        name.className = 'grimoire-spell-name';
        name.textContent = spell.name;
        titleGroup.appendChild(name);
        
        const levelBadge = document.createElement('span');
        levelBadge.className = 'grimoire-spell-level-badge';
        levelBadge.textContent = `Nv. ${spell.level}`;
        titleGroup.appendChild(levelBadge);
        
        header.appendChild(titleGroup);
        card.appendChild(header);
        
        // Descrição
        const description = document.createElement('p');
        description.className = 'grimoire-spell-description';
        description.textContent = spell.description;
        card.appendChild(description);
        
        // Tags
        const tags = document.createElement('div');
        tags.className = 'grimoire-spell-tags';
        
        if (spell.ongoing) {
            const ongoingTag = document.createElement('span');
            ongoingTag.className = 'grimoire-spell-tag ongoing';
            ongoingTag.textContent = 'Contínuo';
            tags.appendChild(ongoingTag);
        }
        
        if (spell.touch) {
            const touchTag = document.createElement('span');
            touchTag.className = 'grimoire-spell-tag';
            touchTag.textContent = 'Toque';
            tags.appendChild(touchTag);
        }
        
        if (tags.children.length > 0) {
            card.appendChild(tags);
        }
        
        return card;
    },
    
    /**
     * Manipula preparação de feitiço para grimório concedido
     */
    handleClericGrantedSpellPrepare(spellId, spellLevel, prepared, clericLevel) {
        const character = Store.get('character');
        if (!character) return;
        
        let preparedSpells = [...(character.clericPreparedSpells || [])];
        
        // Calcula total atual
        const currentTotal = this.calculatePreparedLevels(preparedSpells);
        const limit = clericLevel + 1;
        
        if (prepared) {
            // Verifica se pode preparar mais
            if (currentTotal + spellLevel > limit) {
                // Reverte o checkbox
                const checkbox = document.getElementById(`cleric-spell-${spellId}`);
                if (checkbox) checkbox.checked = false;
                
                this.showLimitWarning(currentTotal, limit, spellLevel);
                return;
            }
            
            if (!preparedSpells.includes(spellId)) {
                preparedSpells.push(spellId);
            }
        } else {
            preparedSpells = preparedSpells.filter(id => id !== spellId);
            
            // Se remover preparação, remove também dos ativos
            let activeSpells = [...(character.activeClericOngoingSpells || [])];
            if (activeSpells.includes(spellId)) {
                activeSpells = activeSpells.filter(id => id !== spellId);
                Store.setCharacterProperty('activeClericOngoingSpells', activeSpells);
            }
        }
        
        Store.setCharacterProperty('clericPreparedSpells', preparedSpells);
        
        // Atualiza visual
        const card = document.querySelector(`[data-spell-id="${spellId}"][data-spell-type="cleric-granted"]`);
        if (card) {
            card.classList.toggle('prepared', prepared);
            
            // Atualiza label
            const label = card.querySelector('.grimoire-checkbox-label');
            if (label) {
                label.textContent = prepared ? 'Preparado' : 'Preparar';
            }
        }
        
        // Atualiza limite
        this.updateClericGrantedLimitDisplay(clericLevel, preparedSpells);
        
        // Re-renderiza para mostrar/esconder toggle de contínuo
        if (typeof CharacterSheetPage !== 'undefined') {
            CharacterSheetPage.renderSection('grimorio');
        }
    },
    
    /**
     * Manipula toggle de feitiço contínuo ativo para grimório concedido
     */
    handleClericGrantedOngoingToggle(spellId, isActive) {
        const character = Store.get('character');
        if (!character) return;
        
        let activeSpells = [...(character.activeClericOngoingSpells || [])];
        
        if (isActive && !activeSpells.includes(spellId)) {
            activeSpells.push(spellId);
        } else if (!isActive) {
            activeSpells = activeSpells.filter(id => id !== spellId);
        }
        
        Store.setCharacterProperty('activeClericOngoingSpells', activeSpells);
        
        // Atualiza visual do card
        const card = document.querySelector(`[data-spell-id="${spellId}"][data-spell-type="cleric-granted"]`);
        if (card) {
            card.classList.toggle('active-ongoing', isActive);
        }
        
        // Atualiza avisos
        const warningsContainer = document.getElementById('grimoire-warnings-cleric-granted');
        if (warningsContainer) {
            warningsContainer.innerHTML = '';
            const newWarnings = this.renderClericGrantedWarnings(Store.get('character'));
            warningsContainer.innerHTML = newWarnings.innerHTML;
        }
    },
    
    /**
     * Atualiza o display do limite para grimório concedido
     */
    updateClericGrantedLimitDisplay(clericLevel, preparedSpells) {
        const display = document.getElementById('grimoire-limit-display-cleric-granted');
        if (!display) return;
        
        const limit = clericLevel + 1;
        const used = this.calculatePreparedLevels(preparedSpells);
        const remaining = limit - used;
        
        display.innerHTML = `
            <span class="grimoire-limit-label">Limite de Feitiços (Nível de Clérigo ${clericLevel}):</span>
            <span class="grimoire-limit-value ${remaining <= 0 ? 'at-limit' : ''}">
                ${used}/${limit} níveis
            </span>
            <span class="grimoire-limit-remaining">(${remaining} restante${remaining !== 1 ? 's' : ''})</span>
        `;
    }
};

// Exporta para uso global
if (typeof window !== 'undefined') {
    window.Grimoire = Grimoire;
}
