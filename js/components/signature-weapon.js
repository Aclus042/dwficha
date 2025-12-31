/**
 * =====================================================
 * DUNGEON WORLD - COMPONENTE: ARMA FAVORITA
 * Sistema interativo de criação da arma favorita do Guerreiro
 * =====================================================
 */

const SignatureWeapon = {
    /**
     * Renderiza o construtor de arma favorita
     * @param {Object} weaponConfig - Configuração da arma do guerreiro.js
     * @param {Object} characterData - Dados do personagem
     * @returns {HTMLElement}
     */
    render(weaponConfig, characterData = null) {
        const container = document.createElement('div');
        container.className = 'signature-weapon-builder';
        container.id = 'signature-weapon-builder';

        // Obter dados salvos
        const savedWeapon = this.getSavedWeapon(characterData);

        // Título e descrição
        const header = document.createElement('div');
        header.className = 'signature-weapon-header';
        header.innerHTML = `
            <h3 class="signature-weapon-title">⚔️ Arma Favorita</h3>
            <p class="signature-weapon-description">${weaponConfig.baseDescription}</p>
        `;
        container.appendChild(header);

        // Preview da arma
        const preview = this.renderPreview(savedWeapon);
        container.appendChild(preview);

        // Etapa 1: Tipo base
        const step1 = this.renderStep({
            stepNumber: 1,
            title: 'Descrição básica (todas possuem peso 2):',
            type: 'single',
            options: weaponConfig.baseTypes.options,
            selectedValue: savedWeapon?.baseType,
            fieldKey: 'baseType',
            characterData
        });
        container.appendChild(step1);

        // Etapa 2: Distância
        const step2 = this.renderStep({
            stepNumber: 2,
            title: 'Distância:',
            type: 'single',
            options: weaponConfig.ranges.options,
            selectedValue: savedWeapon?.range,
            fieldKey: 'range',
            characterData
        });
        container.appendChild(step2);

        // Etapa 3: Melhorias (escolher 2)
        const step3 = this.renderEnhancementsStep({
            stepNumber: 3,
            title: 'Escolha DUAS melhorias:',
            options: weaponConfig.enhancements.options,
            selectedValues: savedWeapon?.enhancements || [],
            maxSelections: weaponConfig.enhancements.count,
            characterData
        });
        container.appendChild(step3);

        // Etapa 4: Aparência
        const step4 = this.renderStep({
            stepNumber: 4,
            title: 'Aparência:',
            type: 'single',
            options: weaponConfig.looks.options,
            selectedValue: savedWeapon?.look,
            fieldKey: 'look',
            characterData
        });
        container.appendChild(step4);

        return container;
    },

    /**
     * Renderiza o preview da arma
     */
    renderPreview(savedWeapon) {
        const preview = document.createElement('div');
        preview.className = 'signature-weapon-preview';
        preview.id = 'signature-weapon-preview';

        if (savedWeapon && savedWeapon.baseType) {
            preview.innerHTML = this.generatePreviewContent(savedWeapon);
        } else {
            preview.innerHTML = `
                <div class="signature-weapon-preview-empty">
                    <span class="preview-icon">🗡️</span>
                    <span class="preview-text">Configure sua arma abaixo</span>
                </div>
            `;
        }

        return preview;
    },

    /**
     * Gera o conteúdo do preview
     */
    generatePreviewContent(weapon) {
        const stats = this.calculateWeaponStats(weapon);
        
        let tagsHtml = stats.tags.map(tag => `<span class="weapon-tag">${tag}</span>`).join('');
        
        return `
            <div class="signature-weapon-preview-content">
                <div class="weapon-preview-header">
                    <span class="weapon-preview-name">${stats.name}</span>
                    <span class="weapon-preview-look">${weapon.look || ''}</span>
                </div>
                <div class="weapon-preview-stats">
                    <div class="weapon-stat">
                        <span class="stat-label">Dano:</span>
                        <span class="stat-value">${stats.damage}</span>
                    </div>
                    <div class="weapon-stat">
                        <span class="stat-label">Peso:</span>
                        <span class="stat-value">${stats.weight}</span>
                    </div>
                </div>
                <div class="weapon-preview-tags">${tagsHtml}</div>
                ${stats.special ? `<div class="weapon-preview-special">${stats.special}</div>` : ''}
            </div>
        `;
    },

    /**
     * Calcula as estatísticas finais da arma
     */
    calculateWeaponStats(weapon) {
        let weight = 2; // Base
        let damageBonus = 0;
        let tags = [];
        let special = '';

        // Adicionar distância como tag
        if (weapon.range) {
            const rangeNames = {
                'mao': 'mão',
                'corpo_a_corpo': 'corpo a corpo',
                'alcance': 'alcance'
            };
            tags.push(rangeNames[weapon.range] || weapon.range);
        }

        // Processar melhorias
        if (weapon.enhancements && weapon.enhancements.length > 0) {
            weapon.enhancements.forEach(enh => {
                switch(enh.id) {
                    case 'ganchos_espinhos':
                        damageBonus += 1;
                        weight += 1;
                        break;
                    case 'afiada':
                        tags.push('+2 penetrante');
                        break;
                    case 'perfeitamente_balanceada':
                        tags.push('precisa');
                        break;
                    case 'fio_serrilhado':
                        damageBonus += 1;
                        break;
                    case 'brilha':
                        special = `Brilha na presença de: ${enh.creatureType || '(escolha uma criatura)'}`;
                        break;
                    case 'enorme':
                        tags.push('grotesca');
                        tags.push('poderosa');
                        break;
                    case 'versatil':
                        if (enh.extraRange) {
                            const rangeNames = {
                                'mao': 'mão',
                                'corpo_a_corpo': 'corpo a corpo',
                                'alcance': 'alcance'
                            };
                            tags.push(rangeNames[enh.extraRange] || enh.extraRange);
                        }
                        break;
                    case 'alta_qualidade':
                        weight -= 1;
                        break;
                }
            });
        }

        // Nome da arma
        const baseNames = {
            'espada': 'Espada',
            'machado': 'Machado',
            'martelo': 'Martelo',
            'lanca': 'Lança',
            'mangual': 'Mangual',
            'punhos': 'Punhos'
        };

        return {
            name: baseNames[weapon.baseType] || 'Arma',
            damage: damageBonus > 0 ? `d10+${damageBonus}` : 'd10',
            weight: Math.max(0, weight),
            tags: tags,
            special: special
        };
    },

    /**
     * Renderiza uma etapa de seleção única
     */
    renderStep({ stepNumber, title, type, options, selectedValue, fieldKey, characterData }) {
        const step = document.createElement('div');
        step.className = 'signature-weapon-step';
        step.setAttribute('data-step', stepNumber);

        const header = document.createElement('div');
        header.className = 'step-header';
        header.innerHTML = `
            <span class="step-number">${stepNumber}</span>
            <span class="step-title">${title}</span>
        `;
        step.appendChild(header);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'step-options step-options-grid';

        options.forEach(option => {
            const isSelected = selectedValue === option.id;
            
            const optionEl = document.createElement('label');
            optionEl.className = `step-option ${isSelected ? 'selected' : ''}`;
            optionEl.htmlFor = `weapon-${fieldKey}-${option.id}`;

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.id = `weapon-${fieldKey}-${option.id}`;
            radio.name = `weapon-${fieldKey}`;
            radio.value = option.id;
            radio.checked = isSelected;
            radio.addEventListener('change', () => {
                this.handleSelectionChange(fieldKey, option.id);
            });

            const text = document.createElement('span');
            text.className = 'option-text';
            text.textContent = option.name;

            optionEl.appendChild(radio);
            optionEl.appendChild(text);
            optionsContainer.appendChild(optionEl);
        });

        step.appendChild(optionsContainer);
        return step;
    },

    /**
     * Renderiza a etapa de melhorias (múltipla seleção com opções especiais)
     */
    renderEnhancementsStep({ stepNumber, title, options, selectedValues, maxSelections, characterData }) {
        const step = document.createElement('div');
        step.className = 'signature-weapon-step signature-weapon-enhancements';
        step.setAttribute('data-step', stepNumber);

        const header = document.createElement('div');
        header.className = 'step-header';
        header.innerHTML = `
            <span class="step-number">${stepNumber}</span>
            <span class="step-title">${title}</span>
            <span class="step-counter" id="enhancement-counter">${selectedValues.length}/${maxSelections}</span>
        `;
        step.appendChild(header);

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'step-options step-options-list';
        optionsContainer.id = 'enhancement-options';

        options.forEach(option => {
            const savedEnhancement = selectedValues.find(e => e.id === option.id);
            const isSelected = !!savedEnhancement;
            const isDisabled = !isSelected && selectedValues.length >= maxSelections;

            const optionEl = document.createElement('div');
            optionEl.className = `enhancement-option ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`;
            optionEl.setAttribute('data-enhancement-id', option.id);

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `weapon-enhancement-${option.id}`;
            checkbox.value = option.id;
            checkbox.checked = isSelected;
            checkbox.disabled = isDisabled;
            checkbox.addEventListener('change', (e) => {
                this.handleEnhancementChange(option, e.target.checked, maxSelections);
            });

            const label = document.createElement('label');
            label.htmlFor = `weapon-enhancement-${option.id}`;
            label.className = 'enhancement-label';

            const nameSpan = document.createElement('span');
            nameSpan.className = 'enhancement-name';
            nameSpan.textContent = option.name;

            const descSpan = document.createElement('span');
            descSpan.className = 'enhancement-desc';
            descSpan.textContent = option.description || '';

            label.appendChild(nameSpan);
            if (option.description) {
                label.appendChild(descSpan);
            }

            optionEl.appendChild(checkbox);
            optionEl.appendChild(label);

            // Campo adicional para "Brilha"
            if (option.id === 'brilha') {
                const extraInput = document.createElement('div');
                extraInput.className = `enhancement-extra ${isSelected ? 'visible' : ''}`;
                extraInput.id = 'brilha-extra';
                extraInput.innerHTML = `
                    <input type="text" 
                           id="weapon-brilha-creature"
                           class="enhancement-input"
                           placeholder="Tipo de criatura..."
                           value="${savedEnhancement?.creatureType || ''}"
                    />
                `;
                const input = extraInput.querySelector('input');
                input.addEventListener('input', (e) => {
                    this.handleEnhancementExtraChange('brilha', 'creatureType', e.target.value);
                });
                optionEl.appendChild(extraInput);
            }

            // Campo adicional para "Versátil"
            if (option.id === 'versatil') {
                const extraInput = document.createElement('div');
                extraInput.className = `enhancement-extra ${isSelected ? 'visible' : ''}`;
                extraInput.id = 'versatil-extra';
                
                const ranges = [
                    { id: 'mao', name: 'Mão' },
                    { id: 'corpo_a_corpo', name: 'Corpo a Corpo' },
                    { id: 'alcance', name: 'Alcance' }
                ];
                
                let rangeOptions = ranges.map(r => 
                    `<option value="${r.id}" ${savedEnhancement?.extraRange === r.id ? 'selected' : ''}>${r.name}</option>`
                ).join('');
                
                extraInput.innerHTML = `
                    <select id="weapon-versatil-range" class="enhancement-select">
                        <option value="">Escolha alcance adicional...</option>
                        ${rangeOptions}
                    </select>
                `;
                const select = extraInput.querySelector('select');
                select.addEventListener('change', (e) => {
                    this.handleEnhancementExtraChange('versatil', 'extraRange', e.target.value);
                });
                optionEl.appendChild(extraInput);
            }

            optionsContainer.appendChild(optionEl);
        });

        step.appendChild(optionsContainer);
        return step;
    },

    /**
     * Manipula mudança de seleção única
     */
    handleSelectionChange(fieldKey, value) {
        const character = Store.get('character');
        if (!character) return;

        if (!character.classSpecific) {
            character.classSpecific = {};
        }
        if (!character.classSpecific.signatureWeapon) {
            character.classSpecific.signatureWeapon = {};
        }

        character.classSpecific.signatureWeapon[fieldKey] = value;
        Store.setCharacterProperty('classSpecific.signatureWeapon', character.classSpecific.signatureWeapon);

        // Atualizar UI
        this.updateStepUI(fieldKey, value);
        this.updatePreview();

        // Disparar evento
        document.dispatchEvent(new CustomEvent('signatureWeaponChanged', {
            detail: { fieldKey, value }
        }));
    },

    /**
     * Manipula mudança de melhoria
     */
    handleEnhancementChange(option, isChecked, maxSelections) {
        const character = Store.get('character');
        if (!character) return;

        if (!character.classSpecific) {
            character.classSpecific = {};
        }
        if (!character.classSpecific.signatureWeapon) {
            character.classSpecific.signatureWeapon = {};
        }
        if (!character.classSpecific.signatureWeapon.enhancements) {
            character.classSpecific.signatureWeapon.enhancements = [];
        }

        let enhancements = character.classSpecific.signatureWeapon.enhancements;

        if (isChecked) {
            if (enhancements.length < maxSelections) {
                enhancements.push({ id: option.id });
            } else {
                // Reverter checkbox
                const checkbox = document.getElementById(`weapon-enhancement-${option.id}`);
                if (checkbox) checkbox.checked = false;
                return;
            }
        } else {
            enhancements = enhancements.filter(e => e.id !== option.id);
        }

        character.classSpecific.signatureWeapon.enhancements = enhancements;
        Store.setCharacterProperty('classSpecific.signatureWeapon', character.classSpecific.signatureWeapon);

        // Atualizar UI
        this.updateEnhancementsUI(enhancements, maxSelections);
        this.updatePreview();

        // Mostrar/esconder campos extras
        const extraEl = document.getElementById(`${option.id}-extra`);
        if (extraEl) {
            extraEl.classList.toggle('visible', isChecked);
        }
    },

    /**
     * Manipula mudança em campo extra de melhoria
     */
    handleEnhancementExtraChange(enhancementId, extraKey, value) {
        const character = Store.get('character');
        if (!character?.classSpecific?.signatureWeapon?.enhancements) return;

        const enhancement = character.classSpecific.signatureWeapon.enhancements.find(e => e.id === enhancementId);
        if (enhancement) {
            enhancement[extraKey] = value;
            Store.setCharacterProperty('classSpecific.signatureWeapon', character.classSpecific.signatureWeapon);
            this.updatePreview();
        }
    },

    /**
     * Atualiza UI de uma etapa
     */
    updateStepUI(fieldKey, selectedValue) {
        const options = document.querySelectorAll(`input[name="weapon-${fieldKey}"]`);
        options.forEach(input => {
            const label = input.closest('.step-option');
            if (label) {
                label.classList.toggle('selected', input.value === selectedValue);
            }
        });
    },

    /**
     * Atualiza UI de melhorias
     */
    updateEnhancementsUI(enhancements, maxSelections) {
        const container = document.getElementById('enhancement-options');
        if (!container) return;

        const counter = document.getElementById('enhancement-counter');
        if (counter) {
            counter.textContent = `${enhancements.length}/${maxSelections}`;
            counter.classList.toggle('complete', enhancements.length === maxSelections);
        }

        const options = container.querySelectorAll('.enhancement-option');
        options.forEach(optionEl => {
            const enhId = optionEl.getAttribute('data-enhancement-id');
            const isSelected = enhancements.some(e => e.id === enhId);
            const isDisabled = !isSelected && enhancements.length >= maxSelections;

            optionEl.classList.toggle('selected', isSelected);
            optionEl.classList.toggle('disabled', isDisabled);

            const checkbox = optionEl.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.checked = isSelected;
                checkbox.disabled = isDisabled;
            }
        });
    },

    /**
     * Atualiza o preview da arma
     */
    updatePreview() {
        const preview = document.getElementById('signature-weapon-preview');
        if (!preview) return;

        const savedWeapon = this.getSavedWeapon();
        
        if (savedWeapon && savedWeapon.baseType) {
            preview.innerHTML = this.generatePreviewContent(savedWeapon);
        } else {
            preview.innerHTML = `
                <div class="signature-weapon-preview-empty">
                    <span class="preview-icon">🗡️</span>
                    <span class="preview-text">Configure sua arma abaixo</span>
                </div>
            `;
        }
    },

    /**
     * Obtém a arma salva
     */
    getSavedWeapon(characterData = null) {
        const character = characterData || Store.get('character');
        if (!character?.classSpecific?.signatureWeapon) return null;
        return character.classSpecific.signatureWeapon;
    },

    /**
     * Obtém estatísticas da arma para exibição no inventário
     */
    getWeaponForInventory(characterData = null) {
        const weapon = this.getSavedWeapon(characterData);
        if (!weapon || !weapon.baseType) return null;

        const stats = this.calculateWeaponStats(weapon);
        
        return {
            name: `${stats.name} ${weapon.look ? `(${weapon.look})` : ''}`.trim(),
            weight: stats.weight,
            damage: stats.damage,
            tags: stats.tags,
            special: stats.special,
            isSignatureWeapon: true
        };
    }
};

// Exporta para uso global
if (typeof window !== 'undefined') {
    window.SignatureWeapon = SignatureWeapon;
}
