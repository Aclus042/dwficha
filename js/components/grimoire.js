/**
 * =====================================================
 * DUNGEON WORLD - COMPONENTE: GRIMÓRIO
 * Renderiza o grimório de feitiços para classes mágicas
 * =====================================================
 */

const Grimoire = {
    // Estado local de accordions abertos
    openAccordions: new Set(['oracoes', 'nivel1']),
    
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
     * Sistema de feitiços baseado em inteligência e níveis de feitiço
     */
    renderMagoGrimoire(characterData) {
        const content = document.createElement('div');
        content.className = 'grimoire-content grimoire-content-mago';
        
        const character = characterData || Store.get('character');
        const level = character?.level || 1;
        const preparedSpells = character?.preparedSpells || [];
        
        // Atualizar display do limite (mesmo sistema do clérigo: nível + 1)
        this.updateMagoLimitDisplay(level, preparedSpells);
        
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
                const section = this.renderMagoSpellSection({
                    title: levelInfo.title,
                    spells: spells,
                    spellLevel: levelInfo.spellLevel,
                    characterLevel: level,
                    preparedSpells: preparedSpells,
                    isLocked: level < levelInfo.minLevel
                });
                content.appendChild(section);
            }
        });
        
        // === FEITIÇOS EXPANDIDOS (de outras classes) ===
        const expandedSpells = character?.expandedSpells || [];
        if (expandedSpells.length > 0) {
            const expandedSection = this.renderExpandedSpellsSection(expandedSpells, preparedSpells);
            content.appendChild(expandedSection);
        }
        
        return content;
    },
    
    /**
     * Renderiza a seção de feitiços expandidos (Grimório Expandido)
     */
    renderExpandedSpellsSection(expandedSpells, preparedSpells) {
        const section = document.createElement('section');
        section.className = 'grimoire-section grimoire-section-expanded';
        
        // Header da seção
        const header = document.createElement('div');
        header.className = 'grimoire-section-header grimoire-section-header-expanded';
        header.innerHTML = `
            <h3 class="grimoire-section-title">
                <span class="expanded-icon">✨</span> Grimório Expandido
            </h3>
            <span class="grimoire-section-badge grimoire-section-badge-expanded">Feitiços de Outras Classes</span>
        `;
        section.appendChild(header);
        
        // Grid de feitiços expandidos
        const grid = document.createElement('div');
        grid.className = 'grimoire-spell-grid';
        
        expandedSpells.forEach(spell => {
            const card = this.renderExpandedSpellCard(spell, {
                isPrepared: preparedSpells.includes(spell.spellId)
            });
            grid.appendChild(card);
        });
        
        section.appendChild(grid);
        
        return section;
    },
    
    /**
     * Renderiza um card de feitiço expandido
     */
    renderExpandedSpellCard(spell, options = {}) {
        const { isPrepared = false } = options;
        
        const card = document.createElement('div');
        card.className = `grimoire-spell-card grimoire-spell-card-expanded ${isPrepared ? 'grimoire-spell-prepared' : ''}`;
        card.setAttribute('data-spell-id', spell.spellId);
        card.setAttribute('data-from-class', spell.fromClass);
        
        // Header do card
        const cardHeader = document.createElement('div');
        cardHeader.className = 'grimoire-spell-header';
        
        const titleWrapper = document.createElement('div');
        titleWrapper.className = 'grimoire-spell-title-wrapper';
        
        const title = document.createElement('h4');
        title.className = 'grimoire-spell-name';
        title.textContent = spell.name;
        titleWrapper.appendChild(title);
        
        // Badge de origem
        const originBadge = document.createElement('span');
        originBadge.className = 'grimoire-spell-origin-badge';
        originBadge.textContent = spell.fromClass === 'clerigo' ? '✝️ Clérigo' : spell.fromClass;
        titleWrapper.appendChild(originBadge);
        
        cardHeader.appendChild(titleWrapper);
        
        // Nível e checkbox
        const actions = document.createElement('div');
        actions.className = 'grimoire-spell-actions';
        
        const levelBadge = document.createElement('span');
        levelBadge.className = 'grimoire-spell-level';
        levelBadge.textContent = `Nv. ${spell.level}`;
        actions.appendChild(levelBadge);
        
        // Checkbox para preparar
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'grimoire-spell-checkbox';
        checkbox.id = `prepare-expanded-${spell.spellId}`;
        checkbox.checked = isPrepared;
        checkbox.addEventListener('change', () => {
            this.handleExpandedSpellPrepare(spell.spellId, checkbox.checked);
        });
        actions.appendChild(checkbox);
        
        cardHeader.appendChild(actions);
        card.appendChild(cardHeader);
        
        // Descrição
        const description = document.createElement('p');
        description.className = 'grimoire-spell-description';
        description.textContent = spell.description;
        card.appendChild(description);
        
        // Tag de contínuo se aplicável
        if (spell.ongoing) {
            const ongoingTag = document.createElement('span');
            ongoingTag.className = 'grimoire-spell-tag grimoire-spell-tag-ongoing';
            ongoingTag.textContent = 'Contínuo';
            card.appendChild(ongoingTag);
        }
        
        return card;
    },
    
    /**
     * Manipula preparação de feitiço expandido
     */
    handleExpandedSpellPrepare(spellId, prepared) {
        const character = Store.get('character');
        if (!character) return;
        
        let preparedSpells = [...(character.preparedSpells || [])];
        
        if (prepared && !preparedSpells.includes(spellId)) {
            preparedSpells.push(spellId);
        } else if (!prepared) {
            preparedSpells = preparedSpells.filter(id => id !== spellId);
        }
        
        Store.setCharacterProperty('preparedSpells', preparedSpells);
        
        // Atualiza visual
        const card = document.querySelector(`[data-spell-id="${spellId}"]`);
        if (card) {
            card.classList.toggle('grimoire-spell-prepared', prepared);
        }
        
        // Atualiza limite
        this.updateMagoLimitDisplay(character.level, preparedSpells);
    },
    
    /**
     * Renderiza a seção de Truques do Mago
     */
    renderMagoTruquesSection() {
        const section = document.createElement('section');
        section.className = 'grimoire-section grimoire-section-truques';
        
        // Header da seção
        const header = document.createElement('div');
        header.className = 'grimoire-section-header';
        header.innerHTML = `
            <h3 class="grimoire-section-title">Truques</h3>
            <span class="grimoire-section-badge grimoire-section-badge-always">Sempre Disponíveis</span>
        `;
        section.appendChild(header);
        
        // Aviso informativo
        const info = document.createElement('div');
        info.className = 'grimoire-info-box';
        info.innerHTML = `
            <span class="grimoire-info-icon">ℹ️</span>
            <p>${MAGO_SPELLS.truquesInfo}</p>
        `;
        section.appendChild(info);
        
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
        
        section.appendChild(grid);
        
        return section;
    },
    
    /**
     * Renderiza uma seção de feitiços do Mago por nível
     */
    renderMagoSpellSection({ title, spells, spellLevel, characterLevel, preparedSpells, isLocked }) {
        const section = document.createElement('section');
        section.className = `grimoire-section grimoire-section-level${spellLevel}`;
        
        if (isLocked) {
            section.classList.add('grimoire-section-locked');
        }
        
        // Header da seção
        const header = document.createElement('div');
        header.className = 'grimoire-section-header';
        
        const titleEl = document.createElement('h3');
        titleEl.className = 'grimoire-section-title';
        titleEl.textContent = title;
        header.appendChild(titleEl);
        
        if (isLocked) {
            const lockBadge = document.createElement('span');
            lockBadge.className = 'grimoire-section-badge grimoire-section-badge-locked';
            lockBadge.textContent = `Requer Nível ${spellLevel}`;
            header.appendChild(lockBadge);
        } else {
            const countBadge = document.createElement('span');
            countBadge.className = 'grimoire-section-badge';
            countBadge.textContent = `${spells.length} feitiços`;
            header.appendChild(countBadge);
        }
        
        section.appendChild(header);
        
        // Grid de feitiços
        const grid = document.createElement('div');
        grid.className = 'grimoire-spell-grid';
        
        const character = Store.get('character');
        const activeOngoingSpells = character?.activeOngoingSpells || [];
        
        spells.forEach(spell => {
            const isPrepared = preparedSpells.includes(spell.id);
            const isActive = activeOngoingSpells.includes(spell.id);
            const canPrepare = !isLocked && spellLevel <= characterLevel;
            
            const card = this.renderMagoSpellCard(spell, {
                isTruque: false,
                isPrepared: isPrepared,
                isActive: isActive,
                isLocked: isLocked,
                canPrepare: canPrepare,
                characterLevel: characterLevel
            });
            grid.appendChild(card);
        });
        
        section.appendChild(grid);
        
        return section;
    },
    
    /**
     * Renderiza um card de feitiço do Mago
     */
    renderMagoSpellCard(spell, options = {}) {
        const {
            isTruque = false,
            isPrepared = false,
            isActive = false,
            isLocked = false,
            canPrepare = true
        } = options;
        
        const card = document.createElement('div');
        card.className = `grimoire-spell-card ${isPrepared ? 'prepared' : ''} ${isLocked ? 'locked' : ''} ${isActive ? 'active-ongoing' : ''}`;
        card.setAttribute('data-spell-id', spell.id);
        card.setAttribute('data-spell-level', spell.level);
        card.setAttribute('data-spell-class', 'mago');
        
        // Header do card
        const header = document.createElement('div');
        header.className = 'grimoire-spell-header';
        
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
     */
    handleMagoSpellToggle(spell, isPrepared, cardElement) {
        const character = Store.get('character');
        if (!character) return;
        
        let preparedSpells = [...(character.preparedSpells || [])];
        const level = character.level || 1;
        const spellLimit = level + 1;
        
        if (isPrepared) {
            // Calcular total de níveis atual
            const currentTotal = this.calculateMagoPreparedLevels(preparedSpells);
            const newTotal = currentTotal + spell.level;
            
            // Verificar se não excede o limite
            if (newTotal > spellLimit) {
                // Reverter checkbox
                const checkbox = cardElement.querySelector('.grimoire-spell-checkbox');
                if (checkbox) checkbox.checked = false;
                
                // Mostrar alerta
                this.showLimitWarning(currentTotal, spellLimit, spell.level);
                return;
            }
            
            // Verificar se nível do feitiço não excede nível do personagem
            if (spell.level > level) {
                const checkbox = cardElement.querySelector('.grimoire-spell-checkbox');
                if (checkbox) checkbox.checked = false;
                return;
            }
            
            preparedSpells.push(spell.id);
            cardElement.classList.add('prepared');
            
            // Habilitar checkbox de ativo se for contínuo
            const activeCheckbox = cardElement.querySelector('.grimoire-active-checkbox');
            if (activeCheckbox) activeCheckbox.disabled = false;
        } else {
            preparedSpells = preparedSpells.filter(id => id !== spell.id);
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
        this.updateMagoLimitDisplay(level, preparedSpells);
        this.updateMagoOngoingWarnings();
        
        // Dispara evento
        document.dispatchEvent(new CustomEvent('spellToggled', {
            detail: { spellId: spell.id, isPrepared, totalLevels: this.calculateMagoPreparedLevels(preparedSpells) }
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
     */
    updateMagoLimitDisplay(characterLevel, preparedSpells) {
        const display = document.getElementById('grimoire-limit-display');
        if (!display) return;
        
        const limit = characterLevel + 1;
        const used = this.calculateMagoPreparedLevels(preparedSpells);
        const remaining = limit - used;
        
        display.innerHTML = `
            <span class="grimoire-limit-label">Limite de Feitiços:</span>
            <span class="grimoire-limit-value ${remaining <= 0 ? 'at-limit' : ''}">
                ${used}/${limit} níveis
            </span>
            <span class="grimoire-limit-remaining">(${remaining} restante${remaining !== 1 ? 's' : ''})</span>
        `;
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
     */
    renderClerigoGrimoire(characterData) {
        const content = document.createElement('div');
        content.className = 'grimoire-content';
        
        const character = characterData || Store.get('character');
        const level = character?.level || 1;
        const preparedSpells = character?.preparedSpells || [];
        
        // Atualizar display do limite
        this.updateLimitDisplay(level, preparedSpells);
        
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
                const section = this.renderSpellSection({
                    title: levelInfo.title,
                    spells: spells,
                    spellLevel: levelInfo.spellLevel,
                    characterLevel: level,
                    preparedSpells: preparedSpells,
                    isLocked: level < levelInfo.minLevel
                });
                content.appendChild(section);
            }
        });
        
        return content;
    },
    
    /**
     * Renderiza a seção de Orações
     */
    renderOracoesSection() {
        const section = document.createElement('section');
        section.className = 'grimoire-section grimoire-section-oracoes';
        
        // Header da seção
        const header = document.createElement('div');
        header.className = 'grimoire-section-header';
        header.innerHTML = `
            <h3 class="grimoire-section-title">Orações</h3>
            <span class="grimoire-section-badge grimoire-section-badge-always">Sempre Disponíveis</span>
        `;
        section.appendChild(header);
        
        // Aviso informativo
        const info = document.createElement('div');
        info.className = 'grimoire-info-box';
        info.innerHTML = `
            <span class="grimoire-info-icon">ℹ️</span>
            <p>${CLERIGO_SPELLS.oracoesInfo}</p>
        `;
        section.appendChild(info);
        
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
        
        section.appendChild(grid);
        
        return section;
    },
    
    /**
     * Renderiza uma seção de feitiços por nível
     */
    renderSpellSection({ title, spells, spellLevel, characterLevel, preparedSpells, isLocked }) {
        const section = document.createElement('section');
        section.className = `grimoire-section grimoire-section-level${spellLevel}`;
        
        if (isLocked) {
            section.classList.add('grimoire-section-locked');
        }
        
        // Header da seção
        const header = document.createElement('div');
        header.className = 'grimoire-section-header';
        
        const titleEl = document.createElement('h3');
        titleEl.className = 'grimoire-section-title';
        titleEl.textContent = title;
        header.appendChild(titleEl);
        
        if (isLocked) {
            const lockBadge = document.createElement('span');
            lockBadge.className = 'grimoire-section-badge grimoire-section-badge-locked';
            lockBadge.textContent = `Requer Nível ${spellLevel}`;
            header.appendChild(lockBadge);
        } else {
            const countBadge = document.createElement('span');
            countBadge.className = 'grimoire-section-badge';
            countBadge.textContent = `${spells.length} feitiços`;
            header.appendChild(countBadge);
        }
        
        section.appendChild(header);
        
        // Grid de feitiços
        const grid = document.createElement('div');
        grid.className = 'grimoire-spell-grid';
        
        const character = Store.get('character');
        const activeOngoingSpells = character?.activeOngoingSpells || [];
        
        spells.forEach(spell => {
            const isPrepared = preparedSpells.includes(spell.id);
            const isActive = activeOngoingSpells.includes(spell.id);
            const canPrepare = !isLocked && spellLevel <= characterLevel;
            
            const card = this.renderSpellCard(spell, {
                isOracao: false,
                isPrepared: isPrepared,
                isActive: isActive,
                isLocked: isLocked,
                canPrepare: canPrepare,
                characterLevel: characterLevel
            });
            grid.appendChild(card);
        });
        
        section.appendChild(grid);
        
        return section;
    },
    
    /**
     * Renderiza um card de feitiço
     */
    renderSpellCard(spell, options = {}) {
        const {
            isOracao = false,
            isPrepared = false,
            isActive = false,
            isLocked = false,
            canPrepare = true
        } = options;
        
        const card = document.createElement('div');
        card.className = `grimoire-spell-card ${isPrepared ? 'prepared' : ''} ${isLocked ? 'locked' : ''} ${isActive ? 'active-ongoing' : ''}`;
        card.setAttribute('data-spell-id', spell.id);
        card.setAttribute('data-spell-level', spell.level);
        
        // Header do card
        const header = document.createElement('div');
        header.className = 'grimoire-spell-header';
        
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
     * Manipula toggle de feitiço preparado
     */
    handleSpellToggle(spell, isPrepared, cardElement) {
        const character = Store.get('character');
        if (!character) return;
        
        let preparedSpells = [...(character.preparedSpells || [])];
        const level = character.level || 1;
        const spellLimit = level + 1;
        
        if (isPrepared) {
            // Calcular total de níveis atual
            const currentTotal = this.calculatePreparedLevels(preparedSpells);
            const newTotal = currentTotal + spell.level;
            
            // Verificar se não excede o limite
            if (newTotal > spellLimit) {
                // Reverter checkbox
                const checkbox = cardElement.querySelector('.grimoire-spell-checkbox');
                if (checkbox) checkbox.checked = false;
                
                // Mostrar alerta
                this.showLimitWarning(currentTotal, spellLimit, spell.level);
                return;
            }
            
            // Verificar se nível do feitiço não excede nível do personagem
            if (spell.level > level) {
                const checkbox = cardElement.querySelector('.grimoire-spell-checkbox');
                if (checkbox) checkbox.checked = false;
                return;
            }
            
            preparedSpells.push(spell.id);
            cardElement.classList.add('prepared');
            
            // Habilitar checkbox de ativo se for contínuo
            const activeCheckbox = cardElement.querySelector('.grimoire-active-checkbox');
            if (activeCheckbox) activeCheckbox.disabled = false;
        } else {
            preparedSpells = preparedSpells.filter(id => id !== spell.id);
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
        this.updateLimitDisplay(level, preparedSpells);
        this.updateOngoingWarnings();
        
        // Dispara evento
        document.dispatchEvent(new CustomEvent('spellToggled', {
            detail: { spellId: spell.id, isPrepared, totalLevels: this.calculatePreparedLevels(preparedSpells) }
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
     * Calcula total de níveis dos feitiços preparados
     */
    calculatePreparedLevels(preparedSpellIds) {
        let total = 0;
        preparedSpellIds.forEach(spellId => {
            const spell = ClerigoSpellsHelper.getSpellById(spellId);
            if (spell && spell.type !== 'oracao') {
                total += spell.level;
            }
        });
        return total;
    },
    
    /**
     * Atualiza o display do limite de feitiços
     */
    updateLimitDisplay(characterLevel, preparedSpells) {
        const display = document.getElementById('grimoire-limit-display');
        if (!display) return;
        
        const limit = characterLevel + 1;
        const used = this.calculatePreparedLevels(preparedSpells);
        const remaining = limit - used;
        
        display.innerHTML = `
            <span class="grimoire-limit-label">Limite de Feitiços:</span>
            <span class="grimoire-limit-value ${remaining <= 0 ? 'at-limit' : ''}">
                ${used}/${limit} níveis
            </span>
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
     * Renderiza uma seção de feitiços para grimório concedido
     */
    renderClericGrantedSpellSection({ title, spells, spellLevel, clericLevel, preparedSpells, isLocked }) {
        const section = document.createElement('section');
        section.className = `grimoire-section grimoire-section-level${spellLevel}`;
        
        if (isLocked) {
            section.classList.add('grimoire-section-locked');
        }
        
        // Header da seção
        const header = document.createElement('div');
        header.className = 'grimoire-section-header';
        
        const titleEl = document.createElement('h3');
        titleEl.className = 'grimoire-section-title';
        titleEl.textContent = title;
        header.appendChild(titleEl);
        
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
        
        section.appendChild(header);
        
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
        
        section.appendChild(grid);
        
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
