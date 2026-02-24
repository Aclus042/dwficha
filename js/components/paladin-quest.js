/**
 * DUNGEON WORLD - COMPONENTE: BUSCA (Paladino)
 * Sistema interativo para configurar a busca sagrada do Paladino
 */
const PaladinQuest = {
    render(config, characterData = null) {
        const saved = this.getSaved(characterData);
        const container = document.createElement('div');
        container.className = 'paladin-quest-builder';
        container.id = 'paladin-quest-builder';
        container.innerHTML = `
            <div class="paladin-quest-header">
                <h3 class="paladin-quest-title">⚔️ Busca Sagrada</h3>
                <p class="paladin-quest-description">${config.description}</p>
            </div>
            <div class="paladin-quest-preview" id="paladin-quest-preview"></div>
        `;
        
        // Passo 1: Tipo de missão
        container.appendChild(this.stepMission(config, saved));
        
        // Passo 2: Dádivas
        container.appendChild(this.stepGifts(config, saved));
        
        // Passo 3: Votos (informativo - MJ define)
        container.appendChild(this.stepVows(config, saved));
        
        setTimeout(() => this.updatePreview(), 0);
        return container;
    },

    stepMission(config, saved) {
        const step = document.createElement('div');
        step.className = 'paladin-quest-step';
        
        // Renderiza o HTML base
        const header = document.createElement('div');
        header.className = 'step-header';
        header.innerHTML = `
            <span class="step-number">1</span>
            <span class="step-title">Diga o que pretende fazer:</span>
        `;
        step.appendChild(header);
        
        // Container de opções
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'step-options step-options-mission';
        
        // Renderiza cada opção
        config.questOptions.forEach((opt, i) => {
            const hasBlank = opt.includes('________________');
            const isSelected = saved?.missionType === i;
            const savedText = saved?.missionTarget || '';
            
            const label = document.createElement('label');
            label.className = 'step-option mission-option';
            if (isSelected) label.classList.add('selected');
            if (hasBlank) label.classList.add('has-editable-field');
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'quest-mission';
            radio.value = i;
            if (isSelected) radio.checked = true;
            
            const textSpan = document.createElement('span');
            textSpan.className = 'option-text';
            
            if (hasBlank) {
                const parts = opt.split('________________');
                
                // Parte inicial do texto
                const textNode1 = document.createTextNode(parts[0]);
                textSpan.appendChild(textNode1);
                
                // Input
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'mission-target-input';
                input.dataset.mission = i;
                input.placeholder = 'Clique para preencher';
                input.maxLength = 50;
                input.value = savedText;
                if (!isSelected) {
                    input.style.display = 'none';
                }
                textSpan.appendChild(input);
                
                // Placeholder visível
                const placeholder = document.createElement('span');
                placeholder.className = 'placeholder-inline';
                placeholder.dataset.mission = i;
                placeholder.textContent = '________________';
                if (isSelected) {
                    placeholder.style.display = 'none';
                }
                textSpan.appendChild(placeholder);
                
                // Parte final do texto
                if (parts[1]) {
                    const textNode2 = document.createTextNode(parts[1]);
                    textSpan.appendChild(textNode2);
                }
            } else {
                textSpan.textContent = opt;
            }
            
            label.appendChild(radio);
            label.appendChild(textSpan);
            optionsContainer.appendChild(label);
        });
        
        step.appendChild(optionsContainer);
        
        setTimeout(() => {
            this.bindMissionEventsV2(step, config);
        }, 0);
        
        return step;
    },

    bindMissionEventsV2(step, config) {
        // Evento para seleção de missão
        step.querySelectorAll('input[name="quest-mission"]').forEach(radio => {
            radio.addEventListener('change', () => {
                const missionIndex = parseInt(radio.value);
                
                // Salva o tipo de missão
                this.save('missionType', missionIndex);
                this.save('missionTarget', '');
                
                // Esconde todos os inputs e mostra apenas o selecionado
                step.querySelectorAll('.mission-target-input').forEach(inp => {
                    inp.style.display = 'none';
                    inp.value = '';
                });
                step.querySelectorAll('.placeholder-inline').forEach(ph => {
                    ph.style.display = 'inline-block';
                });
                
                // Mostra o input da opção selecionada
                const selectedInput = step.querySelector(`.mission-target-input[data-mission="${missionIndex}"]`);
                const selectedPlaceholder = step.querySelector(`.placeholder-inline[data-mission="${missionIndex}"]`);
                
                if (selectedInput) {
                    selectedInput.style.display = 'inline-block';
                    selectedPlaceholder.style.display = 'none';
                    selectedInput.focus();
                }
                
                // Atualiza preview
                this.updatePreview();
            });
        });
        
        // Evento para input de texto da missão - captura enquanto digita
        step.querySelectorAll('.mission-target-input').forEach(input => {
            input.addEventListener('input', (e) => {
                this.save('missionTarget', e.target.value);
                this.updatePreview();
            });
            input.addEventListener('change', (e) => {
                this.save('missionTarget', e.target.value);
                this.updatePreview();
            });
        });
        
        // Evento para clicar no placeholder (campo em branco)
        step.querySelectorAll('.placeholder-inline').forEach(placeholder => {
            placeholder.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const missionIndex = parseInt(placeholder.dataset.mission);
                const radio = step.querySelector(`input[name="quest-mission"][value="${missionIndex}"]`);
                if (radio) {
                    radio.click();
                }
            });
        });
    },

    stepGifts(config, saved) {
        const maxGifts = this.getMaxGifts();
        const selectedGifts = saved?.gifts || [];
        
        const step = document.createElement('div');
        step.className = 'paladin-quest-step';
        step.id = 'paladin-quest-gifts-step';
        
        // Header
        const header = document.createElement('div');
        header.className = 'step-header';
        header.innerHTML = `
            <span class="step-number">2</span>
            <span class="step-title">${config.giftNote}</span>
            <span class="step-counter" id="gifts-counter">${selectedGifts.length}/${maxGifts}</span>
        `;
        step.appendChild(header);
        
        // Container de opções
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'step-options step-options-gifts';
        
        // Renderiza cada dádiva
        config.gifts.forEach((gift, i) => {
            const hasBlank = gift.includes('________________');
            const isSelected = selectedGifts.some(g => g.index === i);
            const savedData = selectedGifts.find(g => g.index === i);
            const isDisabled = !isSelected && selectedGifts.length >= maxGifts;
            
            const label = document.createElement('label');
            label.className = 'step-option gift-option';
            if (isSelected) label.classList.add('selected');
            if (hasBlank) label.classList.add('has-editable-field');
            if (isDisabled) label.classList.add('disabled');
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'quest-gift';
            checkbox.value = i;
            checkbox.disabled = isDisabled;
            if (isSelected) checkbox.checked = true;
            
            const textSpan = document.createElement('span');
            textSpan.className = 'option-text';
            
            if (hasBlank) {
                const parts = gift.split('________________');
                
                // Parte inicial do texto
                const textNode1 = document.createTextNode(parts[0]);
                textSpan.appendChild(textNode1);
                
                // Input
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'gift-target-input';
                input.dataset.gift = i;
                input.placeholder = 'Clique para preencher';
                input.maxLength = 50;
                input.value = savedData?.target || '';
                if (!isSelected) {
                    input.style.display = 'none';
                }
                textSpan.appendChild(input);
                
                // Placeholder visível
                const placeholder = document.createElement('span');
                placeholder.className = 'placeholder-inline';
                placeholder.dataset.gift = i;
                placeholder.textContent = '________________';
                if (isSelected) {
                    placeholder.style.display = 'none';
                }
                textSpan.appendChild(placeholder);
                
                // Parte final do texto
                if (parts[1]) {
                    const textNode2 = document.createTextNode(parts[1]);
                    textSpan.appendChild(textNode2);
                }
            } else {
                textSpan.textContent = gift;
            }
            
            label.appendChild(checkbox);
            label.appendChild(textSpan);
            optionsContainer.appendChild(label);
        });
        
        step.appendChild(optionsContainer);
        
        setTimeout(() => {
            this.bindGiftEventsV2(step, config);
        }, 0);
        
        return step;
    },

    bindGiftEventsV2(step, config) {
        const maxGifts = this.getMaxGifts();
        
        // Evento para seleção de dádivas
        step.querySelectorAll('input[name="quest-gift"]').forEach(cb => {
            cb.addEventListener('change', () => {
                const saved = this.getSaved();
                const selectedGifts = saved?.gifts || [];
                const giftIndex = parseInt(cb.value);
                
                if (cb.checked) {
                    // Adiciona dádiva
                    const targetInput = step.querySelector(`.gift-target-input[data-gift="${giftIndex}"]`);
                    selectedGifts.push({
                        index: giftIndex,
                        text: config.gifts[giftIndex],
                        target: targetInput?.value || ''
                    });
                } else {
                    // Remove dádiva
                    const idx = selectedGifts.findIndex(g => g.index === giftIndex);
                    if (idx >= 0) {
                        selectedGifts.splice(idx, 1);
                    }
                }
                
                this.save('gifts', selectedGifts);
                
                // Atualiza visibilidade dos inputs
                step.querySelectorAll('.gift-target-input').forEach(inp => {
                    inp.style.display = 'none';
                });
                step.querySelectorAll('.placeholder-inline').forEach(ph => {
                    ph.style.display = 'inline-block';
                });
                
                selectedGifts.forEach(g => {
                    const input = step.querySelector(`.gift-target-input[data-gift="${g.index}"]`);
                    const placeholder = step.querySelector(`.placeholder-inline[data-gift="${g.index}"]`);
                    if (input) {
                        input.style.display = 'inline-block';
                        placeholder.style.display = 'none';
                    }
                });
                
                // Atualiza contador
                const counter = step.querySelector('#gifts-counter');
                if (counter) {
                    counter.textContent = `${selectedGifts.length}/${maxGifts}`;
                    counter.classList.toggle('complete', selectedGifts.length === maxGifts);
                }
                
                // Habilita/desabilita checkboxes adicionais
                const isLimitReached = selectedGifts.length >= maxGifts;
                step.querySelectorAll('input[name="quest-gift"]').forEach(chk => {
                    const idx = parseInt(chk.value);
                    const isChecked = selectedGifts.some(g => g.index === idx);
                    chk.disabled = !isChecked && isLimitReached;
                    
                    const label = chk.closest('label');
                    if (isLimitReached && !isChecked) {
                        label.classList.add('disabled');
                    } else {
                        label.classList.remove('disabled');
                    }
                });
                
                this.updatePreview();
            });
        });
        
        // Evento para input de texto das dádivas
        step.querySelectorAll('.gift-target-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const giftIndex = parseInt(e.target.dataset.gift);
                const saved = this.getSaved();
                const gifts = saved?.gifts || [];
                const gift = gifts.find(g => g.index === giftIndex);
                if (gift) {
                    gift.target = e.target.value;
                    this.save('gifts', gifts);
                    this.updatePreview();
                }
            });
            input.addEventListener('change', (e) => {
                const giftIndex = parseInt(e.target.dataset.gift);
                const saved = this.getSaved();
                const gifts = saved?.gifts || [];
                const gift = gifts.find(g => g.index === giftIndex);
                if (gift) {
                    gift.target = e.target.value;
                    this.save('gifts', gifts);
                    this.updatePreview();
                }
            });
        });
        
        // Evento para clicar no placeholder (campo em branco)
        step.querySelectorAll('.placeholder-inline').forEach(placeholder => {
            placeholder.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const giftIndex = parseInt(placeholder.dataset.gift);
                const checkbox = step.querySelector(`input[name="quest-gift"][value="${giftIndex}"]`);
                if (checkbox && !checkbox.disabled) {
                    checkbox.click();
                }
            });
        });
    },

    stepVows(config, saved) {
        const selectedVows = saved?.vows || [];
        
        const step = document.createElement('div');
        step.className = 'paladin-quest-step';
        step.innerHTML = `
            <div class="step-header">
                <span class="step-number">3</span>
                <span class="step-title">${config.vowNote}</span>
            </div>
            <div class="step-info">
                <span>ℹ️</span> Os votos são definidos pelo MJ. Marque abaixo os votos que você deve manter.
            </div>
            <div class="step-options step-options-vows">
                ${config.vows.map(vow => {
                    const isSelected = selectedVows.includes(vow.id);
                    return `
                        <label class="step-option vow-option ${isSelected ? 'selected' : ''}">
                            <input type="checkbox" name="quest-vow" value="${vow.id}" ${isSelected ? 'checked' : ''}>
                            <span class="option-text">
                                <strong>${vow.name}</strong>
                                <span class="vow-restriction">(${vow.restriction})</span>
                            </span>
                        </label>
                    `;
                }).join('')}
            </div>
        `;
        
        setTimeout(() => {
            step.querySelectorAll('input[name="quest-vow"]').forEach(cb => {
                cb.addEventListener('change', () => {
                    const selectedVows = [...step.querySelectorAll('input[name="quest-vow"]:checked')]
                        .map(c => c.value);
                    this.save('vows', selectedVows);
                    
                    step.querySelectorAll('.vow-option').forEach(opt => {
                        opt.classList.toggle('selected', opt.querySelector('input').checked);
                    });
                });
            });
        }, 0);
        
        return step;
    },

    getMaxGifts() {
        const char = Store.get('character');
        const acquiredMoves = char?.acquiredMoves || [];
        // Prova de Fé concede 3 dádivas ao invés de 2
        return acquiredMoves.includes('prova_fe') ? 3 : 2;
    },

    save(key, value) {
        const char = Store.get('character');
        if (!char) return;
        char.classSpecific = char.classSpecific || {};
        char.classSpecific.paladinQuest = char.classSpecific.paladinQuest || {};
        char.classSpecific.paladinQuest[key] = value;
        Store.setCharacterProperty('classSpecific.paladinQuest', char.classSpecific.paladinQuest);
        this.updatePreview();
    },

    updatePreview() {
        const preview = document.getElementById('paladin-quest-preview');
        if (!preview) return;
        
        const saved = this.getSaved();
        const config = CLASS_PALADINO?.quest;
        
        if (!config || saved?.missionType === undefined) {
            preview.innerHTML = `
                <div class="paladin-quest-preview-empty">
                    <span class="preview-icon">⚔️</span>
                    <span class="preview-text">Configure sua busca sagrada abaixo</span>
                </div>
            `;
            return;
        }
        
        // Monta a missão
        let missionText = config.questOptions[saved.missionType];
        if (saved.missionTarget) {
            missionText = missionText.replace('________________', `<strong>${saved.missionTarget}</strong>`);
        } else {
            missionText = missionText.replace('________________', '<em>___</em>');
        }
        
        // Monta as dádivas
        const giftsHtml = (saved.gifts || []).map(gift => {
            let text = gift.text;
            if (gift.target) {
                text = text.replace('________________', `<strong>${gift.target}</strong>`);
            } else if (text.includes('________________')) {
                text = text.replace('________________', '<em>___</em>');
            }
            return `<span class="quest-tag tag-gift">${text}</span>`;
        }).join('');
        
        // Monta os votos
        const vowsHtml = (saved.vows || []).map(vowId => {
            const vow = config.vows.find(v => v.id === vowId);
            return vow ? `<span class="quest-tag tag-vow"><strong>${vow.name}</strong></span>` : '';
        }).join('');
        
        preview.innerHTML = `
            <div class="quest-preview-section">
                <span class="section-label">🎯 Missão:</span>
                <div class="quest-mission-text">${missionText}</div>
            </div>
            ${giftsHtml ? `
                <div class="quest-preview-section">
                    <span class="section-label">✨ Dádivas:</span>
                    <div class="quest-tags">${giftsHtml}</div>
                </div>
            ` : ''}
            ${vowsHtml ? `
                <div class="quest-preview-section">
                    <span class="section-label">📜 Votos:</span>
                    <div class="quest-tags">${vowsHtml}</div>
                </div>
            ` : ''}
        `;
    },

    getSaved(char = null) {
        return (char || Store.get('character'))?.classSpecific?.paladinQuest || null;
    },

    getQuest(char = null) {
        const saved = this.getSaved(char);
        const config = CLASS_PALADINO?.quest;
        if (!saved || !config) return null;
        
        return {
            missionType: saved.missionType,
            missionTarget: saved.missionTarget || '',
            missionText: config.questOptions[saved.missionType] || '',
            gifts: saved.gifts || [],
            vows: saved.vows || []
        };
    }
};

if (typeof window !== 'undefined') window.PaladinQuest = PaladinQuest;
