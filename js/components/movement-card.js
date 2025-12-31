/**
 * =====================================================
 * DUNGEON WORLD - COMPONENTE: CARTÃO DE MOVIMENTO
 * Renderiza movimentos com suporte a escolhas interativas
 * =====================================================
 */

const MovementCard = {
    /**
     * Renderiza um cartão de movimento
     * @param {Object} move - Dados do movimento
     * @param {Object} options - Opções de renderização
     * @returns {HTMLElement} - Elemento do cartão
     */
    render(move, options = {}) {
        const {
            showCheckbox = false,
            isAcquired = false,
            isStarting = false,
            compact = false,
            showAttribute = true,
            characterData = null,
            moveCategory = null,
            classData = null
        } = options;

        const card = document.createElement('div');
        card.className = `movement-card ${compact ? 'movement-card-compact' : ''}`;
        card.setAttribute('data-move-id', move.id);
        
        // Verificação de nível
        let isLocked = false;
        let lockReason = null;
        if (characterData && moveCategory && classData) {
            const availability = Helpers.isMoveAvailable(move, characterData.level, moveCategory);
            isLocked = !availability.available;
            lockReason = availability.reason;
            
            // Verifica se ainda há slots disponíveis (apenas para movimentos não adquiridos e avançados)
            if (!isLocked && !isAcquired && moveCategory !== 'starting') {
                const availableSlots = Helpers.getAvailableMoveSlots(characterData, classData);
                if (availableSlots <= 0) {
                    isLocked = true;
                    lockReason = `Sem slots disponíveis (você pode escolher ${Helpers.getMaxAdvancedMoves(characterData.level)} movimento${Helpers.getMaxAdvancedMoves(characterData.level) !== 1 ? 's' : ''} avançado${Helpers.getMaxAdvancedMoves(characterData.level) !== 1 ? 's' : ''})`;
                }
            }
        }
        
        if (isStarting) {
            card.classList.add('movement-card-starting');
        }
        
        if (move.required) {
            card.classList.add('movement-card-required');
        }
        
        if (isAcquired) {
            card.classList.add('movement-card-acquired');
        }
        
        if (isLocked) {
            card.classList.add('movement-card-locked');
            card.setAttribute('data-lock-reason', lockReason);
        }

        // Cabeçalho do movimento
        const header = this.renderHeader(move, { showCheckbox, isAcquired, showAttribute, isLocked });
        card.appendChild(header);
        
        // Indicador de bloqueio por nível
        if (isLocked && lockReason) {
            const lockBadge = document.createElement('div');
            lockBadge.className = 'movement-lock-badge';
            lockBadge.innerHTML = `
                <span class="lock-icon">🔒</span>
                <span class="lock-text">${lockReason}</span>
            `;
            card.appendChild(lockBadge);
        }

        // Gatilho (trigger)
        if (move.trigger) {
            const trigger = document.createElement('p');
            trigger.className = 'movement-trigger';
            trigger.textContent = move.trigger;
            card.appendChild(trigger);
        }

        // Descrição
        if (move.description && !compact) {
            const description = document.createElement('div');
            description.className = 'movement-description';
            description.innerHTML = Helpers.formatMovementText(move.description);
            card.appendChild(description);
        }

        // Resultados de rolagem (se houver)
        if (move.results && !compact) {
            const results = this.renderResults(move.results);
            card.appendChild(results);
        }

        // Opções parciais (lista de escolhas para 7-9)
        if (move.partialOptions && !compact) {
            const partialOptionsSection = this.renderOptions(move.partialOptions);
            card.appendChild(partialOptionsSection);
        }

        // Opções de alvo (Ranger - Tiro ao Alvo)
        if (move.targetOptions && !compact) {
            const targetOptionsSection = this.renderTargetOptions(move.targetOptions);
            card.appendChild(targetOptionsSection);
        }

        // Nota adicional do movimento
        if (move.note && !compact) {
            const noteSection = document.createElement('div');
            noteSection.className = 'movement-note';
            noteSection.innerHTML = `<p>${Helpers.formatMovementText(move.note)}</p>`;
            card.appendChild(noteSection);
        }

        // === ESCOLHAS INTERATIVAS ===
        
        // Indicador de geração de XP
        if (move.grantsXP && !compact) {
            const xpIndicator = document.createElement('div');
            xpIndicator.className = 'movement-xp-indicator';
            xpIndicator.innerHTML = `
                <span class="xp-badge">⭐ Gera XP</span>
                ${move.xpTrigger ? `<span class="xp-trigger">${move.xpTrigger}</span>` : ''}
            `;
            card.appendChild(xpIndicator);
        }
        
        // Campo de texto para nome da divindade (Clérigo)
        if (move.requiresDeityName && !compact) {
            const deityNameSection = this.renderTextInput({
                moveId: move.id,
                inputKey: 'deityName',
                label: 'Nome da sua divindade:',
                placeholder: 'Ex: Helferth, Sucellus, Zorica, Krugon o Cruel...',
                characterData
            });
            card.appendChild(deityNameSection);
        }
        
        // Lista de apetites (Bárbaro - Apetite Hercúleo)
        if (move.appetitesList && !compact) {
            const appetiteLimit = this.getAppetiteLimit(characterData);
            const titleText = appetiteLimit > 2 
                ? `Escolha ${appetiteLimit} apetites (${appetiteLimit - 2} bônus de Contínuo Faminto):`
                : 'Escolha dois apetites:';
            
            const choicesSection = this.renderMultipleChoice({
                moveId: move.id,
                choiceKey: 'appetites',
                title: titleText,
                options: move.appetitesList,
                maxSelections: appetiteLimit,
                characterData
            });
            card.appendChild(choicesSection);
            
            // Efeito dos apetites (texto especial)
            if (move.appetiteEffect) {
                const effectSection = document.createElement('div');
                effectSection.className = 'movement-appetite-effect';
                effectSection.innerHTML = `
                    <div class="appetite-effect-header">
                        <span class="appetite-effect-icon">🎲</span>
                        <strong>Efeito dos Apetites:</strong>
                    </div>
                    <p class="appetite-effect-text">${move.appetiteEffect}</p>
                `;
                card.appendChild(effectSection);
            }
        }
        
        // Áreas de conhecimento (Bardo - Conhecimento de Bardo)
        if (move.loreOptions && !compact) {
            const choicesSection = this.renderSingleChoice({
                moveId: move.id,
                choiceKey: 'bardLore',
                title: 'Escolha uma área de especialização:',
                options: move.loreOptions,
                characterData
            });
            card.appendChild(choicesSection);
        }
        
        // Domínios de divindade (Clérigo)
        // Domínio + Preceito juntos (Clérigo)
        // Domínios de divindade (Clérigo)
        if (move.domainOptions && !compact) {
            const choicesSection = this.renderSingleChoice({
                moveId: move.id,
                choiceKey: 'divineDomain',
                title: 'Escolha seu domínio:',
                options: move.domainOptions,
                characterData
            });
            card.appendChild(choicesSection);
        }
        // Preceitos religiosos (Clérigo)
        if (move.preceptOptions && !compact) {
            const choicesSection = this.renderSingleChoice({
                moveId: move.id,
                choiceKey: 'divinePrecept',
                title: 'Escolha um preceito:',
                options: move.preceptOptions,
                characterData
            });
            card.appendChild(choicesSection);
        }
        
        // Escolha de estilo de combate (Bárbaro)
        if (move.combatStyleOptions && !compact) {
            const choicesSection = this.renderSingleChoice({
                moveId: move.id,
                choiceKey: 'combatStyle',
                title: 'Escolha um estilo:',
                options: move.combatStyleOptions.map(o => o.name),
                optionDescriptions: move.combatStyleOptions.map(o => o.description),
                characterData
            });
            card.appendChild(choicesSection);
        }
        
        // Sistema de venenos (Ladrão - Envenenador)
        if (move.hasPoisonSystem && move.poisonOptions && !compact) {
            const poisonSection = this.renderPoisonSystem({
                moveId: move.id,
                poisonOptions: move.poisonOptions,
                characterData
            });
            card.appendChild(poisonSection);
        }
        
        // Sistema de condições de Ritual (Mago)
        if (move.hasRitualConditions && move.ritualConditions && !compact) {
            const ritualSection = this.renderRitualConditions({
                moveId: move.id,
                conditions: move.ritualConditions,
                characterData
            });
            card.appendChild(ritualSection);
        }
        
        // Seleção de Terra (Druida - Nascido do Solo)
        if (move.landOptions && !compact) {
            const landSection = this.renderSingleChoice({
                moveId: move.id,
                choiceKey: 'druidLand',
                title: 'Escolha sua terra:',
                options: move.landOptions,
                characterData
            });
            card.appendChild(landSection);
        }
        
        // Campo para Marca Física (Druida - Nascido do Solo)
        if (move.requiresMark && !compact) {
            const markSection = this.renderTextInput({
                moveId: move.id,
                inputKey: 'druidMark',
                label: move.markDescription || 'Sua marca física:',
                placeholder: move.markPlaceholder || 'Descreva sua marca...',
                characterData
            });
            card.appendChild(markSection);
        }
        
        // Sistema de Domínio/Hold (Druida - Metamorfose, etc.)
        if (move.hasHoldSystem && !compact) {
            const holdNote = document.createElement('div');
            holdNote.className = 'movement-system-note movement-hold-note';
            holdNote.innerHTML = `
                <span class="note-icon">🔮</span>
                <span class="note-text">Este movimento usa <strong>${move.holdName || 'domínio'}</strong>. Gerencie seus pontos durante a sessão.</span>
            `;
            card.appendChild(holdNote);
        }
        
        // Sistema de Arma Favorita (Guerreiro)
        if (move.hasSignatureWeaponBuilder && !compact) {
            const weaponNote = document.createElement('div');
            weaponNote.className = 'movement-system-note movement-weapon-note';
            weaponNote.innerHTML = `
                <span class="note-icon">⚔️</span>
                <span class="note-text">${move.signatureWeaponNote || 'Configure sua arma favorita na seção dedicada abaixo.'}</span>
            `;
            card.appendChild(weaponNote);
        }
        
        // Sistema de Busca Sagrada (Paladino)
        if (move.hasQuestBuilder && !compact) {
            const questNote = document.createElement('div');
            questNote.className = 'movement-system-note movement-quest-note';
            questNote.innerHTML = `
                <span class="note-icon">⚔️</span>
                <span class="note-text">${move.questBuilderNote || 'Configure sua busca sagrada na seção dedicada abaixo.'}</span>
            `;
            card.appendChild(questNote);
        }
        
        // Nota de sistema de Grimório (Mago)
        if (move.hasGrimoireSystem && move.grimoireNote && !compact) {
            const grimoireNote = document.createElement('div');
            grimoireNote.className = 'movement-system-note movement-grimoire-note';
            grimoireNote.innerHTML = `
                <span class="note-icon">📖</span>
                <span class="note-text">${move.grimoireNote}</span>
            `;
            card.appendChild(grimoireNote);
        }
        
        // Nota de feitiço (penalidade por feitiços contínuos)
        if (move.spellNote && !compact) {
            const spellNote = document.createElement('div');
            spellNote.className = 'movement-spell-note';
            spellNote.innerHTML = `<em>⚠️ ${move.spellNote}</em>`;
            card.appendChild(spellNote);
        }
        
        // Opções de domínio (hold options) - Lista de perguntas/efeitos
        if (move.holdOptions && move.holdOptions.length > 0 && !compact) {
            const holdSection = this.renderHoldOptions(move.holdOptions);
            card.appendChild(holdSection);
        }

        // Opções genéricas (lista não-interativa, apenas informativa)
        if (move.options && move.options.length > 0 && !compact && !move.appetitesList && !move.loreOptions) {
            const optionsList = this.renderOptions(move.options);
            card.appendChild(optionsList);
        }
        
        // Opções de comando (Ranger - Comandar)
        if (move.commandOptions && move.commandOptions.length > 0 && !compact) {
            const commandSection = this.renderCommandOptions(move.commandOptions);
            card.appendChild(commandSection);
        }
        
        // Requisito de outro movimento
        if (move.requires) {
            const requires = document.createElement('p');
            requires.className = 'movement-requires';
            requires.innerHTML = `<strong>Requer:</strong> ${move.requires}`;
            card.appendChild(requires);
        }
        
        // Substitui outro movimento
        if (move.replaces) {
            const replaces = document.createElement('p');
            replaces.className = 'movement-replaces';
            replaces.innerHTML = `<strong>Substitui:</strong> ${move.replaces}`;
            card.appendChild(replaces);
        }
        
        // Aviso de movimento de primeiro avanço
        if (move.isFirstAdvanceOnly && !compact) {
            const firstAdvanceNote = document.createElement('div');
            firstAdvanceNote.className = 'movement-first-advance-note';
            firstAdvanceNote.innerHTML = `
                <span class="first-advance-icon">⚠️</span>
                <span class="first-advance-text">${move.firstAdvanceNote || 'Adquira este movimento apenas em seu primeiro avanço de nível.'}</span>
            `;
            card.appendChild(firstAdvanceNote);
        }

        return card;
    },

    /**
     * Renderiza o cabeçalho do movimento
     */
    renderHeader(move, options = {}) {
        const { showCheckbox, isAcquired, showAttribute, isLocked } = options;
        
        const header = document.createElement('div');
        header.className = 'movement-header';

        // Checkbox para aquisição (movimentos avançados)
        if (showCheckbox) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'movement-checkbox';
            checkbox.checked = isAcquired;
            checkbox.id = `move-${move.id}`;
            checkbox.disabled = isLocked; // Desabilita se bloqueado
            checkbox.addEventListener('change', (e) => {
                this.handleToggleMove(move.id, e.target.checked, move);
            });
            header.appendChild(checkbox);
        }

        // Badge de obrigatório
        if (move.required) {
            const badge = document.createElement('span');
            badge.className = 'movement-badge movement-badge-required';
            badge.textContent = 'Obrigatório';
            header.appendChild(badge);
        }

        // Nome do movimento
        const name = document.createElement('h4');
        name.className = 'movement-name';
        
        if (showCheckbox) {
            const label = document.createElement('label');
            label.htmlFor = `move-${move.id}`;
            label.textContent = move.name;
            name.appendChild(label);
        } else {
            name.textContent = move.name;
        }
        header.appendChild(name);

        // Atributo (se houver)
        if (showAttribute && move.attribute) {
            const attr = document.createElement('span');
            attr.className = 'movement-attribute';
            attr.textContent = `+${move.attribute.toUpperCase()}`;
            attr.title = this.getAttributeFullName(move.attribute);
            header.appendChild(attr);
        }

        return header;
    },

    /**
     * Renderiza uma seção de escolha múltipla (checkbox)
     */
    renderMultipleChoice({ moveId, choiceKey, title, options, maxSelections = 2, characterData }) {
        const container = document.createElement('div');
        container.className = 'movement-choices movement-choices-multiple';
        container.setAttribute('data-choice-key', choiceKey);
        container.setAttribute('data-max', maxSelections);

        const titleEl = document.createElement('p');
        titleEl.className = 'movement-choices-title';
        titleEl.textContent = title;
        container.appendChild(titleEl);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'movement-choices-options';

        // Obter escolhas salvas
        const savedChoices = this.getSavedChoices(choiceKey, characterData) || [];

        options.forEach((option, index) => {
            const optionId = `${moveId}-${choiceKey}-${index}`;
            const isSelected = savedChoices.includes(option);
            const isDisabled = !isSelected && savedChoices.length >= maxSelections;

            const label = document.createElement('label');
            label.className = `movement-choice-item ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`;
            label.htmlFor = optionId;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = optionId;
            checkbox.name = `${moveId}-${choiceKey}`;
            checkbox.value = option;
            checkbox.checked = isSelected;
            checkbox.disabled = isDisabled;
            checkbox.addEventListener('change', (e) => {
                this.handleMultipleChoiceChange(e, choiceKey, option, maxSelections, container);
            });

            const text = document.createElement('span');
            text.className = 'movement-choice-text';
            text.textContent = option;

            label.appendChild(checkbox);
            label.appendChild(text);
            optionsContainer.appendChild(label);
        });

        container.appendChild(optionsContainer);

        // Contador de seleções
        const counter = document.createElement('p');
        counter.className = 'movement-choices-counter';
        counter.textContent = `${savedChoices.length}/${maxSelections} selecionados`;
        container.appendChild(counter);

        return container;
    },

    /**
     * Renderiza uma seção de escolha única (radio)
     */
    renderSingleChoice({ moveId, choiceKey, title, options, optionDescriptions = [], characterData }) {
        const container = document.createElement('div');
        container.className = 'movement-choices movement-choices-single';
        container.setAttribute('data-choice-key', choiceKey);

        const titleEl = document.createElement('p');
        titleEl.className = 'movement-choices-title';
        titleEl.textContent = title;
        container.appendChild(titleEl);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'movement-choices-options';

        // Obter escolha salva
        const savedChoice = this.getSavedChoices(choiceKey, characterData);

        options.forEach((option, index) => {
            const optionId = `${moveId}-${choiceKey}-${index}`;
            const isSelected = savedChoice === option;

            const label = document.createElement('label');
            label.className = `movement-choice-item ${isSelected ? 'selected' : ''}`;
            label.htmlFor = optionId;

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.id = optionId;
            radio.name = `${moveId}-${choiceKey}`;
            radio.value = option;
            radio.checked = isSelected;
            radio.addEventListener('change', (e) => {
                this.handleSingleChoiceChange(e, choiceKey, option, container);
            });

            const textContainer = document.createElement('span');
            textContainer.className = 'movement-choice-text';
            textContainer.textContent = option;
            
            // Adicionar descrição se houver
            if (optionDescriptions[index]) {
                const desc = document.createElement('small');
                desc.className = 'movement-choice-description';
                desc.textContent = optionDescriptions[index];
                textContainer.appendChild(desc);
            }

            label.appendChild(radio);
            label.appendChild(textContainer);
            optionsContainer.appendChild(label);
        });

        container.appendChild(optionsContainer);

        return container;
    },

    /**
     * Renderiza um campo de texto para entrada personalizada
     */
    renderTextInput({ moveId, inputKey, label, placeholder = '', characterData }) {
        const container = document.createElement('div');
        container.className = 'movement-text-input';
        container.setAttribute('data-input-key', inputKey);

        const labelEl = document.createElement('label');
        labelEl.className = 'movement-text-label';
        labelEl.htmlFor = `${moveId}-${inputKey}`;
        labelEl.textContent = label;
        container.appendChild(labelEl);

        const input = document.createElement('input');
        input.type = 'text';
        input.id = `${moveId}-${inputKey}`;
        input.className = 'movement-text-field';
        input.placeholder = placeholder;
        
        // Obter valor salvo
        const savedValue = this.getSavedChoices(inputKey, characterData) || '';
        input.value = savedValue;

        // Debounce para salvar
        let saveTimeout;
        input.addEventListener('input', (e) => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                this.handleTextInputChange(inputKey, e.target.value);
            }, 300);
        });

        container.appendChild(input);

        return container;
    },

    /**
     * Manipula mudança em campo de texto
     */
    handleTextInputChange(inputKey, value) {
        const character = Store.get('character');
        if (!character) return;

        // Inicializa classSpecific se não existir
        if (!character.classSpecific) {
            character.classSpecific = {};
        }

        Store.setCharacterProperty(`classSpecific.${inputKey}`, value);

        // Dispara evento
        document.dispatchEvent(new CustomEvent('moveTextInputChanged', {
            detail: { inputKey, value }
        }));
    },

    /**
     * Manipula mudança em escolha múltipla
     */
    handleMultipleChoiceChange(event, choiceKey, option, maxSelections, container) {
        const character = Store.get('character');
        if (!character) return;

        // Inicializa classSpecific se não existir
        if (!character.classSpecific) {
            character.classSpecific = {};
        }

        let currentChoices = character.classSpecific[choiceKey] || [];

        if (event.target.checked) {
            if (currentChoices.length < maxSelections) {
                currentChoices.push(option);
            } else {
                event.target.checked = false;
                return;
            }
        } else {
            currentChoices = currentChoices.filter(c => c !== option);
        }

        Store.setCharacterProperty(`classSpecific.${choiceKey}`, currentChoices);

        // Atualizar UI
        this.updateMultipleChoiceUI(container, currentChoices, maxSelections);

        // Dispara evento
        document.dispatchEvent(new CustomEvent('moveChoiceChanged', {
            detail: { choiceKey, choices: currentChoices }
        }));
    },

    /**
     * Manipula mudança em escolha única
     */
    handleSingleChoiceChange(event, choiceKey, option, container) {
        const character = Store.get('character');
        if (!character) return;

        // Inicializa classSpecific se não existir
        if (!character.classSpecific) {
            character.classSpecific = {};
        }

        Store.setCharacterProperty(`classSpecific.${choiceKey}`, option);

        // Atualizar UI
        container.querySelectorAll('.movement-choice-item').forEach(item => {
            item.classList.remove('selected');
        });
        event.target.closest('.movement-choice-item').classList.add('selected');

        // Dispara evento
        document.dispatchEvent(new CustomEvent('moveChoiceChanged', {
            detail: { choiceKey, choice: option }
        }));
    },

    /**
     * Atualiza UI de escolha múltipla
     */
    updateMultipleChoiceUI(container, currentChoices, maxSelections) {
        const items = container.querySelectorAll('.movement-choice-item');
        const counter = container.querySelector('.movement-choices-counter');

        items.forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            const isSelected = currentChoices.includes(checkbox.value);
            const isDisabled = !isSelected && currentChoices.length >= maxSelections;

            item.classList.toggle('selected', isSelected);
            item.classList.toggle('disabled', isDisabled);
            checkbox.disabled = isDisabled;
        });

        if (counter) {
            counter.textContent = `${currentChoices.length}/${maxSelections} selecionados`;
            counter.classList.toggle('complete', currentChoices.length === maxSelections);
        }
    },

    /**
     * Obtém escolhas salvas do personagem
     */
    getSavedChoices(choiceKey, characterData) {
        const character = characterData || Store.get('character');
        if (!character || !character.classSpecific) return null;
        return character.classSpecific[choiceKey] || null;
    },

    /**
     * Calcula o limite dinâmico de apetites baseado nos movimentos adquiridos
     * Base: 2 apetites
     * +1 para cada vez que "Contínuo Faminto" é adquirido
     */
    getAppetiteLimit(characterData) {
        const character = characterData || Store.get('character');
        let limit = 2; // Base inicial
        
        if (character && character.acquiredMoves) {
            // Contínuo Faminto adiciona +1 apetite
            if (character.acquiredMoves.includes('continuo_faminto')) {
                limit += 1;
            }
        }
        
        return limit;
    },

    /**
     * Renderiza os resultados de rolagem
     */
    renderResults(results) {
        const container = document.createElement('div');
        container.className = 'movement-results';

        if (results.success) {
            const success = document.createElement('div');
            success.className = 'movement-result movement-result-success';
            success.innerHTML = `
                <span class="result-label">10+</span>
                <span class="result-text">${Helpers.formatMovementText(results.success)}</span>
            `;
            container.appendChild(success);
        }

        if (results.partial) {
            const partial = document.createElement('div');
            partial.className = 'movement-result movement-result-partial';
            partial.innerHTML = `
                <span class="result-label">7-9</span>
                <span class="result-text">${Helpers.formatMovementText(results.partial)}</span>
            `;
            container.appendChild(partial);
        }

        if (results.fail) {
            const fail = document.createElement('div');
            fail.className = 'movement-result movement-result-fail';
            fail.innerHTML = `
                <span class="result-label">6-</span>
                <span class="result-text">${Helpers.formatMovementText(results.fail)}</span>
            `;
            container.appendChild(fail);
        }

        return container;
    },

    /**
     * Renderiza uma lista de opções (não interativa)
     */
    renderOptions(options) {
        const container = document.createElement('div');
        container.className = 'movement-options-container';
        
        const list = document.createElement('ul');
        list.className = 'movement-options-list';

        options.forEach(option => {
            const item = document.createElement('li');
            item.innerHTML = Helpers.formatMovementText(option);
            list.appendChild(item);
        });

        container.appendChild(list);
        return container;
    },

    /**
     * Renderiza opções de alvo (Ranger - Tiro ao Alvo)
     */
    renderTargetOptions(targetOptions) {
        const container = document.createElement('div');
        container.className = 'movement-target-options';

        targetOptions.forEach(target => {
            const targetDiv = document.createElement('div');
            targetDiv.className = 'movement-target-option';
            targetDiv.innerHTML = `
                <div class="target-option-header">
                    <strong class="target-name">• ${target.name}:</strong>
                </div>
                <div class="target-option-results">
                    <div class="target-result target-result-partial">
                        <span class="result-label">7-9</span>
                        <span class="result-text">${target.partial}</span>
                    </div>
                    <div class="target-result target-result-success">
                        <span class="result-label">10+</span>
                        <span class="result-text">${target.success}</span>
                    </div>
                </div>
            `;
            container.appendChild(targetDiv);
        });

        return container;
    },

    /**
     * Renderiza opções de comando (Ranger - Comandar)
     */
    renderCommandOptions(commandOptions) {
        const container = document.createElement('div');
        container.className = 'movement-command-options';

        const list = document.createElement('ul');
        list.className = 'movement-command-list';

        commandOptions.forEach(option => {
            const item = document.createElement('li');
            item.className = 'movement-command-item';
            item.innerHTML = Helpers.formatMovementText(option);
            list.appendChild(item);
        });

        container.appendChild(list);
        return container;
    },

    /**
     * Renderiza opções de domínio/hold (perguntas que podem ser feitas)
     */
    renderHoldOptions(holdOptions) {
        const container = document.createElement('div');
        container.className = 'movement-hold-options';

        const list = document.createElement('ul');
        list.className = 'movement-hold-list';

        holdOptions.forEach(option => {
            const item = document.createElement('li');
            item.className = 'movement-hold-item';
            item.innerHTML = Helpers.formatMovementText(option);
            list.appendChild(item);
        });

        container.appendChild(list);
        return container;
    },

    /**
     * Renderiza o sistema de venenos (Ladrão)
     */
    renderPoisonSystem({ moveId, poisonOptions, characterData }) {
        const container = document.createElement('div');
        container.className = 'movement-poison-system';
        container.setAttribute('data-choice-key', 'selectedPoison');

        // Título
        const titleEl = document.createElement('p');
        titleEl.className = 'movement-poison-title';
        titleEl.textContent = 'Escolha seu veneno:';
        container.appendChild(titleEl);

        // Container para opções de veneno
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'movement-poison-options';

        // Obter veneno salvo
        const savedPoison = this.getSavedChoices('selectedPoison', characterData);

        poisonOptions.forEach((poison, index) => {
            const optionId = `${moveId}-poison-${index}`;
            const isSelected = savedPoison === poison.id;

            const poisonCard = document.createElement('label');
            poisonCard.className = `movement-poison-card ${isSelected ? 'selected' : ''}`;
            poisonCard.htmlFor = optionId;

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.id = optionId;
            radio.name = `${moveId}-poison`;
            radio.value = poison.id;
            radio.checked = isSelected;
            radio.addEventListener('change', (e) => {
                this.handlePoisonChange(e, poison, container);
            });

            const content = document.createElement('div');
            content.className = 'movement-poison-content';

            const nameEl = document.createElement('span');
            nameEl.className = 'movement-poison-name';
            nameEl.textContent = poison.name;

            const typeEl = document.createElement('span');
            typeEl.className = `movement-poison-type movement-poison-type-${poison.type}`;
            typeEl.textContent = poison.type;

            const effectEl = document.createElement('p');
            effectEl.className = 'movement-poison-effect';
            effectEl.textContent = poison.effect;

            content.appendChild(nameEl);
            content.appendChild(typeEl);
            content.appendChild(effectEl);

            poisonCard.appendChild(radio);
            poisonCard.appendChild(content);
            optionsContainer.appendChild(poisonCard);
        });

        container.appendChild(optionsContainer);

        // Informações adicionais
        const infoSection = document.createElement('div');
        infoSection.className = 'movement-poison-info';
        infoSection.innerHTML = `
            <p class="movement-poison-rule"><strong>Você começa com 3 doses</strong> do veneno escolhido.</p>
            <p class="movement-poison-rule">Quando tiver <strong>tempo e local adequado</strong>, pode criar mais 3 doses.</p>
            <p class="movement-poison-rule"><strong>Aplicado:</strong> absorvido por uma superfície. <strong>Toque:</strong> aplicado na corrente sanguínea.</p>
        `;
        container.appendChild(infoSection);

        return container;
    },

    /**
     * Manipula mudança de veneno escolhido
     */
    handlePoisonChange(event, poison, container) {
        const character = Store.get('character');
        if (!character) return;

        // Inicializa classSpecific se não existir
        if (!character.classSpecific) {
            character.classSpecific = {};
        }

        // Salvar veneno escolhido
        Store.setCharacterProperty('classSpecific.selectedPoison', poison.id);
        Store.setCharacterProperty('classSpecific.selectedPoisonData', {
            id: poison.id,
            name: poison.name,
            type: poison.type,
            effect: poison.effect,
            doses: 3
        });

        // Atualizar UI
        container.querySelectorAll('.movement-poison-card').forEach(card => {
            card.classList.remove('selected');
        });
        event.target.closest('.movement-poison-card').classList.add('selected');

        // Atualizar inventário com o veneno
        this.updateInventoryWithPoison(poison);

        // Dispara evento
        document.dispatchEvent(new CustomEvent('poisonChoiceChanged', {
            detail: { poison }
        }));
    },

    /**
     * Atualiza o inventário com o veneno escolhido
     */
    updateInventoryWithPoison(poison) {
        const character = Store.get('character');
        if (!character) return;

        let inventory = character.inventory || [];
        
        // Remove venenos anteriores (se houver)
        inventory = inventory.filter(item => !item.isPoisonFromClass);

        // Adiciona o novo veneno
        const poisonItem = {
            id: Helpers.generateId(),
            name: `${poison.name} (3 doses)`,
            weight: 0,
            tags: [poison.type, 'veneno'],
            quantity: 3,
            isPoisonFromClass: true,
            poisonEffect: poison.effect
        };

        inventory.push(poisonItem);
        Store.setCharacterProperty('inventory', inventory);
    },

    /**
     * Renderiza as condições de Ritual (Mago)
     */
    renderRitualConditions({ moveId, conditions, characterData }) {
        const container = document.createElement('div');
        container.className = 'movement-ritual-conditions';

        const titleEl = document.createElement('p');
        titleEl.className = 'movement-ritual-title';
        titleEl.textContent = 'Condições possíveis do MJ:';
        container.appendChild(titleEl);

        const conditionsList = document.createElement('ul');
        conditionsList.className = 'movement-ritual-list';

        conditions.forEach(condition => {
            const item = document.createElement('li');
            item.className = 'movement-ritual-item';

            if (condition.editable) {
                // Condição com campo editável
                const savedValue = this.getSavedChoices(condition.editableField, characterData) || '';
                const parts = condition.text.split('__________');
                
                item.innerHTML = `
                    <span class="ritual-text-before">${parts[0]}</span>
                    <input type="text" 
                           class="ritual-input input" 
                           placeholder="..." 
                           value="${savedValue}"
                           data-field="${condition.editableField}">
                    <span class="ritual-text-after">${parts[1] || ''}</span>
                `;

                const input = item.querySelector('.ritual-input');
                let saveTimeout;
                input.addEventListener('input', (e) => {
                    clearTimeout(saveTimeout);
                    saveTimeout = setTimeout(() => {
                        this.handleRitualFieldChange(condition.editableField, e.target.value);
                    }, 300);
                });
            } else {
                // Condição fixa
                item.innerHTML = `<span class="ritual-text">${condition.text}</span>`;
            }

            conditionsList.appendChild(item);
        });

        container.appendChild(conditionsList);
        return container;
    },

    /**
     * Manipula mudança em campo de condição de ritual
     */
    handleRitualFieldChange(fieldKey, value) {
        const character = Store.get('character');
        if (!character) return;

        if (!character.classSpecific) {
            character.classSpecific = {};
        }

        Store.setCharacterProperty(`classSpecific.${fieldKey}`, value);
    },

    /**
     * Renderiza uma seção de movimentos
     */
    renderSection(title, moves, options = {}) {
        const section = document.createElement('div');
        section.className = 'movement-section';
        
        // Adiciona classe especial para seções colapsáveis
        if (options.collapsible) {
            section.classList.add('movement-section-collapsible');
            section.classList.add('collapsed'); // Começa colapsada
        }

        const header = document.createElement('div');
        header.className = 'movement-section-header';
        
        // Adiciona funcionalidade de collapse
        if (options.collapsible) {
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => {
                section.classList.toggle('collapsed');
            });
        }
        
        header.innerHTML = `
            ${options.collapsible ? '<span class="collapse-icon">▼</span>' : ''}
            <h3 class="movement-section-title">${title}</h3>
            <div class="movement-section-info">
                <span class="movement-section-count">${moves.length} movimentos</span>
            </div>
        `;
        section.appendChild(header);

        const grid = document.createElement('div');
        grid.className = 'movement-grid';

        const characterData = Store.get('character');

        moves.forEach(move => {
            const isAcquired = typeof options.isAcquired === 'function' 
                ? options.isAcquired(move) 
                : options.isAcquired || false;
            
            const card = this.render(move, {
                ...options,
                isAcquired,
                characterData,
                moveCategory: options.moveCategory || null,
                classData: options.classData || null
            });
            grid.appendChild(card);
        });

        section.appendChild(grid);

        return section;
    },

    /**
     * Renderiza todos os movimentos básicos
     */
    renderBasicMoves() {
        const moves = Object.values(BASIC_MOVES);
        return this.renderSection('Movimentos Básicos', moves, {
            showAttribute: true
        });
    },

    /**
     * Renderiza todos os movimentos especiais
     */
    renderSpecialMoves() {
        const moves = Object.values(SPECIAL_MOVES);
        return this.renderSection('Movimentos Especiais', moves, {
            showAttribute: true
        });
    },

    /**
     * Renderiza os movimentos de uma classe específica
     */
    renderClassMoves(classId, acquiredMoves = []) {
        const classData = getClassById(classId);
        if (!classData) return document.createDocumentFragment();

        const fragment = document.createDocumentFragment();
        const acquiredIds = new Set(acquiredMoves);

        // Movimentos iniciais
        if (classData.startingMoves && classData.startingMoves.length > 0) {
            const startingSection = this.renderSection(
                'Movimentos Iniciais',
                classData.startingMoves,
                { isStarting: true }
            );
            fragment.appendChild(startingSection);
        }
        
        // Seção de Movimentos Avançados Adquiridos
        const allAdvancedMoves = [
            ...(classData.advancedMoves2_5 || []),
            ...(classData.advancedMoves6_10 || [])
        ];
        const acquiredAdvancedMoves = allAdvancedMoves.filter(move => acquiredIds.has(move.id));
        
        if (acquiredAdvancedMoves.length > 0) {
            const acquiredSection = this.renderSection(
                'Movimentos Avançados',
                acquiredAdvancedMoves,
                {
                    isAcquired: true,
                    showCheckbox: false,
                    classData: classData
                }
            );
            fragment.appendChild(acquiredSection);
        }
        
        // Movimentos de Multiclasse (renderiza aqui, antes das cascatas)
        const character = Store.get('character');
        const multiclassMoves = character?.multiclassMoves || [];
        if (multiclassMoves.length > 0) {
            const multiclassSection = this.renderMulticlassMovesSection(multiclassMoves);
            fragment.appendChild(multiclassSection);
        }
        
        // Sistema de Arma Favorita (Guerreiro)
        if (classData.signatureWeapon && typeof SignatureWeapon !== 'undefined') {
            const weaponBuilder = SignatureWeapon.render(classData.signatureWeapon);
            fragment.appendChild(weaponBuilder);
        }
        
        // Sistema de Companheiro Animal (Ranger)
        if (classData.animalCompanion && typeof AnimalCompanion !== 'undefined') {
            const companionBuilder = AnimalCompanion.render(classData.animalCompanion);
            fragment.appendChild(companionBuilder);
        }
        
        // Sistema de Busca Sagrada (Paladino)
        if (classData.quest && typeof PaladinQuest !== 'undefined') {
            const questBuilder = PaladinQuest.render(classData.quest);
            fragment.appendChild(questBuilder);
        }

        // Movimentos avançados (níveis 2-5)
        if (classData.advancedMoves2_5 && classData.advancedMoves2_5.length > 0) {
            const advanced2_5 = this.renderSection(
                'Movimentos Avançados (Níveis 2-5)',
                classData.advancedMoves2_5,
                {
                    showCheckbox: true,
                    isAcquired: (move) => acquiredIds.has(move.id),
                    moveCategory: '2-5',
                    classData: classData,
                    collapsible: true
                }
            );
            fragment.appendChild(advanced2_5);
        }

        // Movimentos avançados (níveis 6-10)
        if (classData.advancedMoves6_10 && classData.advancedMoves6_10.length > 0) {
            const advanced6_10 = this.renderSection(
                'Movimentos Avançados (Níveis 6-10)',
                classData.advancedMoves6_10,
                {
                    showCheckbox: true,
                    isAcquired: (move) => acquiredIds.has(move.id),
                    moveCategory: '6-10',
                    classData: classData,
                    collapsible: true
                }
            );
            fragment.appendChild(advanced6_10);
        }

        return fragment;
    },

    /**
     * Manipula a marcação/desmarcação de um movimento
     */
    handleToggleMove(moveId, acquired, moveData = null) {
        const character = Store.get('character');
        if (!character) return;

        let moves = [...(character.acquiredMoves || [])];

        if (acquired && !moves.includes(moveId)) {
            moves.push(moveId);
            
            // Verifica se é um movimento de multiclasse
            if (moveData && moveData.allowsMulticlass) {
                Store.setCharacterProperty('acquiredMoves', moves);
                
                // Determina quais classes estão disponíveis
                let availableClasses = [];
                
                if (moveData.multiclassFrom && Array.isArray(moveData.multiclassFrom)) {
                    // Lista específica de classes (ex: bárbaro - guerreiro, bardo, ladrão)
                    availableClasses = moveData.multiclassFrom;
                } else if (moveData.multiclassSource) {
                    // Uma única classe específica (ex: druida -> ranger)
                    availableClasses = [moveData.multiclassSource];
                } else {
                    // Qualquer classe (exceto a própria)
                    availableClasses = CLASS_LIST
                        .map(c => c.id)
                        .filter(id => id !== character.classId);
                }
                
                // Abre o modal de multiclasse
                if (typeof MulticlassModal !== 'undefined' && availableClasses.length > 0) {
                    MulticlassModal.open(moveId, availableClasses);
                }
                return;
            }
            
            // Verifica se é um movimento que permite feitiço de outra classe (Grimório Expandido)
            if (moveData && moveData.allowsSpellFromOtherClass) {
                Store.setCharacterProperty('acquiredMoves', moves);
                // Abre o modal de seleção de feitiço
                if (typeof ExpandedSpellModal !== 'undefined') {
                    ExpandedSpellModal.open(moveId, moveData.spellSource);
                }
                return;
            }
            
            // Verifica se é um movimento que concede poderes de clérigo (Favor Divino / Deuses em Meio à Desolação)
            if (moveData && moveData.grantsClericSpells) {
                // Salva o nível em que adquiriu a habilidade
                if (!character.clericLevelAcquiredAt) {
                    Store.setCharacterProperty('clericLevelAcquiredAt', character.level || 1);
                }
                
                // Adiciona os movimentos de clérigo aos movimentos de multiclasse
                if (moveData.grantsClericMoves && Array.isArray(moveData.grantsClericMoves)) {
                    const clerigoClass = getClassById('clerigo');
                    if (clerigoClass) {
                        const clerigoMoves = clerigoClass.startingMoves || [];
                        const multiclassMoves = [...(character.multiclassMoves || [])];
                        
                        moveData.grantsClericMoves.forEach(clericMoveId => {
                            // Evita duplicatas
                            if (multiclassMoves.some(m => m.moveId === clericMoveId)) return;
                            
                            const clericMove = clerigoMoves.find(m => m.id === clericMoveId);
                            if (clericMove) {
                                multiclassMoves.push({
                                    moveId: clericMove.id,
                                    fromClass: 'clerigo',
                                    grantedBy: moveId,
                                    name: clericMove.name,
                                    description: clericMove.description,
                                    trigger: clericMove.trigger || null,
                                    attribute: clericMove.attribute || null,
                                    results: clericMove.results || null,
                                    options: clericMove.options || null,
                                    partialOptions: clericMove.partialOptions || null
                                });
                            }
                        });
                        
                        Store.setCharacterProperty('multiclassMoves', multiclassMoves);
                    }
                }
                
                // Inicializa o grimório de clérigo se não existir
                if (!character.clericGrimoireSpells) {
                    Store.setCharacterProperty('clericGrimoireSpells', []);
                }
                if (!character.clericPreparedSpells) {
                    Store.setCharacterProperty('clericPreparedSpells', []);
                }
                
                Store.setCharacterProperty('acquiredMoves', moves);
                
                // Atualiza a navegação para mostrar o Grimório e a seção de movimentos
                if (typeof CharacterSheetPage !== 'undefined') {
                    CharacterSheetPage.renderNavigation();
                    CharacterSheetPage.renderSection('movimentos');
                }
                return;
            }
        } else if (!acquired) {
            moves = moves.filter(id => id !== moveId);
            
            // Se desmarcar um movimento de multiclasse, remove os movimentos obtidos por ele
            const multiclassMoves = character.multiclassMoves || [];
            const updatedMulticlass = multiclassMoves.filter(m => m.grantedBy !== moveId);
            if (updatedMulticlass.length !== multiclassMoves.length) {
                Store.setCharacterProperty('multiclassMoves', updatedMulticlass);
            }
            
            // Se desmarcar Grimório Expandido, remove o feitiço expandido
            const expandedSpells = character.expandedSpells || [];
            const updatedExpanded = expandedSpells.filter(s => s.grantedBy !== moveId);
            if (updatedExpanded.length !== expandedSpells.length) {
                Store.setCharacterProperty('expandedSpells', updatedExpanded);
            }
            
            // Se desmarcar movimento que concede poderes de clérigo, remove tudo relacionado
            if (moveData && moveData.grantsClericSpells) {
                Store.setCharacterProperty('clericLevelAcquiredAt', null);
                Store.setCharacterProperty('clericGrimoireSpells', []);
                Store.setCharacterProperty('clericPreparedSpells', []);
                Store.setCharacterProperty('activeClericOngoingSpells', []);
                
                // Atualiza a navegação para esconder o Grimório
                if (typeof CharacterSheetPage !== 'undefined') {
                    CharacterSheetPage.renderNavigation();
                }
            }
        }

        Store.setCharacterProperty('acquiredMoves', moves);

        // Dispara evento para atualizar a UI
        document.dispatchEvent(new CustomEvent('movementToggled', {
            detail: { moveId, acquired }
        }));
        
        // Re-renderiza a seção de movimentos para atualizar os contadores e bloqueios
        if (typeof CharacterSheetPage !== 'undefined') {
            CharacterSheetPage.renderSection('movimentos');
        }
    },

    /**
     * Retorna o nome completo do atributo
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
     * Renderiza a seção de movimentos de multiclasse
     * @param {Array} multiclassMoves - Movimentos obtidos via multiclasse
     * @returns {HTMLElement}
     */
    renderMulticlassMovesSection(multiclassMoves) {
        const section = document.createElement('div');
        section.className = 'movement-section multiclass-section';
        
        const header = document.createElement('div');
        header.className = 'movement-section-header';
        header.innerHTML = `
            <h3 class="movement-section-title">🌟 Movimentos de Multiclasse</h3>
            <div class="movement-section-info">
                <span class="movement-section-count">${multiclassMoves.length} movimento${multiclassMoves.length > 1 ? 's' : ''}</span>
            </div>
        `;
        section.appendChild(header);
        
        const grid = document.createElement('div');
        grid.className = 'movement-grid multiclass-moves-grid';
        
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
        
        section.appendChild(grid);
        return section;
    }
};

// Exporta para uso global
if (typeof window !== 'undefined') {
    window.MovementCard = MovementCard;
    
    // Listener para atualizar UI quando movimentos são adquiridos
    document.addEventListener('movementToggled', (e) => {
        const { moveId, acquired } = e.detail;
        
        // Se Contínuo Faminto foi toggled, atualiza a seção de apetites
        if (moveId === 'continuo_faminto') {
            const appetiteSection = document.querySelector('[data-choice-key="appetites"]');
            if (appetiteSection) {
                const character = Store.get('character');
                const newLimit = MovementCard.getAppetiteLimit(character);
                const currentChoices = character?.classSpecific?.appetites || [];
                
                // Atualiza o título
                const titleEl = appetiteSection.querySelector('.movement-choices-title');
                if (titleEl) {
                    titleEl.textContent = newLimit > 2 
                        ? `Escolha ${newLimit} apetites (${newLimit - 2} bônus de Contínuo Faminto):`
                        : 'Escolha dois apetites:';
                }
                
                // Atualiza o contador e estados
                MovementCard.updateMultipleChoiceUI(appetiteSection, currentChoices, newLimit);
            }
        }
    });
}
