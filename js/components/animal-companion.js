/**
 * DUNGEON WORLD - COMPONENTE: COMPANHEIRO ANIMAL (Ranger)
 */
const AnimalCompanion = {
    render(config, characterData = null) {
        const saved = this.getSaved(characterData);
        const container = document.createElement('div');
        container.className = 'animal-companion-builder';
        container.id = 'animal-companion-builder';
        container.innerHTML = `
            <div class="animal-companion-header">
                <h3 class="animal-companion-title">🐺 Companheiro Animal</h3>
                <p class="animal-companion-description">${config.description}</p>
            </div>
            <div class="animal-companion-preview" id="animal-companion-preview"></div>
        `;
        container.appendChild(this.stepName(saved));
        container.appendChild(this.stepRadio('2', 'Escolha uma espécie:', 'species', config.speciesOptions, saved?.species));
        container.appendChild(this.stepBase(config, saved));
        container.appendChild(this.stepMulti('4', config.strengthsNote, 'strengths', config.strengths, saved, config));
        container.appendChild(this.stepMulti('5', config.trainingNote, 'trainings', config.trainings, saved, config, true));
        container.appendChild(this.stepMulti('6', config.weaknessesNote, 'weaknesses', config.weaknesses, saved, config));
        setTimeout(() => this.updatePreview(), 0);
        return container;
    },

    stepName(saved) {
        const step = document.createElement('div');
        step.className = 'animal-companion-step';
        step.innerHTML = `<div class="step-header"><span class="step-number">1</span><span class="step-title">Dê um nome ao seu companheiro:</span></div>
            <input type="text" class="companion-name-input" id="companion-name" placeholder="Nome" value="${saved?.name || ''}" maxlength="30">`;
        setTimeout(() => step.querySelector('#companion-name')?.addEventListener('change', e => this.save('name', e.target.value)), 0);
        return step;
    },

    stepRadio(num, title, field, options, selected) {
        const step = document.createElement('div');
        step.className = 'animal-companion-step';
        step.innerHTML = `<div class="step-header"><span class="step-number">${num}</span><span class="step-title">${title}</span></div>
            <div class="step-options step-options-species">${options.map(o => `<label class="step-option ${selected === o ? 'selected' : ''}"><input type="radio" name="c-${field}" value="${o}" ${selected === o ? 'checked' : ''}><span class="option-text">${o}</span></label>`).join('')}</div>`;
        setTimeout(() => step.querySelectorAll(`input[name="c-${field}"]`).forEach(r => r.addEventListener('change', () => {
            this.save(field, r.value);
            step.querySelectorAll('.step-option').forEach(o => o.classList.toggle('selected', o.querySelector('input').checked));
        })), 0);
        return step;
    },

    stepBase(config, saved) {
        const step = document.createElement('div');
        step.className = 'animal-companion-step';
        step.innerHTML = `<div class="step-header"><span class="step-number">3</span><span class="step-title">${config.baseNote}</span></div>
            <div class="step-options step-options-base">${config.bases.map((b, i) => `<label class="step-option base-option ${saved?.baseIndex === i ? 'selected' : ''}"><input type="radio" name="c-base" value="${i}" ${saved?.baseIndex === i ? 'checked' : ''}>
                <div class="base-stats"><span><strong>Ferocidade</strong> +${b.ferocity}</span><span><strong>Astúcia</strong> +${b.cunning}</span><span><strong>Armadura</strong> ${b.armor}</span><span><strong>Instinto</strong> +${b.instinct}</span></div></label>`).join('')}</div>`;
        setTimeout(() => step.querySelectorAll('input[name="c-base"]').forEach(r => r.addEventListener('change', () => {
            this.saveBase(parseInt(r.value), config);
            step.querySelectorAll('.base-option').forEach(o => o.classList.toggle('selected', o.querySelector('input').checked));
        })), 0);
        return step;
    },

    stepMulti(num, title, field, options, saved, config, hasInfo = false) {
        const base = saved?.baseIndex !== undefined ? config.bases[saved.baseIndex] : null;
        const max = this.getMax(field, base);
        const sel = saved?.[field] || [];
        const step = document.createElement('div');
        step.className = 'animal-companion-step';
        step.dataset.field = field;
        step.innerHTML = `<div class="step-header"><span class="step-number">${num}</span><span class="step-title">${title}</span><span class="step-counter" id="${field}-counter">${sel.length}/${max}</span></div>
            ${hasInfo ? '<div class="step-info"><span>ℹ️</span> Seu animal já é treinado para enfrentar <strong>humanoides</strong>.</div>' : ''}
            <div class="step-options step-options-multi">${options.map(o => {
                const isSel = sel.includes(o), isDis = !isSel && sel.length >= max;
                return `<label class="step-option multi-option ${isSel ? 'selected' : ''} ${isDis ? 'disabled' : ''}"><input type="checkbox" name="c-${field}" value="${o}" ${isSel ? 'checked' : ''} ${isDis ? 'disabled' : ''}><span class="option-text">${o}</span></label>`;
            }).join('')}</div>`;
        setTimeout(() => step.querySelectorAll(`input[name="c-${field}"]`).forEach(cb => cb.addEventListener('change', () => {
            const selected = [...step.querySelectorAll(`input[name="c-${field}"]:checked`)].map(c => c.value);
            this.save(field, selected);
            this.updateMultiUI(step, field, config);
        })), 0);
        return step;
    },

    getMax(field, base) {
        if (!base) return 0;
        return { strengths: base.ferocity, trainings: base.cunning, weaknesses: base.instinct }[field] || 0;
    },

    updateMultiUI(step, field, config) {
        const saved = this.getSaved(), base = saved?.baseIndex !== undefined ? config.bases[saved.baseIndex] : null;
        const max = this.getMax(field, base), sel = saved?.[field] || [];
        const counter = step.querySelector(`#${field}-counter`);
        if (counter) { counter.textContent = `${sel.length}/${max}`; counter.classList.toggle('complete', sel.length === max); }
        step.querySelectorAll('.multi-option').forEach(opt => {
            const cb = opt.querySelector('input'), isSel = cb.checked, isDis = !isSel && sel.length >= max;
            opt.classList.toggle('selected', isSel); opt.classList.toggle('disabled', isDis); cb.disabled = isDis;
        });
        this.updatePreview();
    },

    save(key, value) {
        const char = Store.get('character');
        if (!char) return;
        char.classSpecific = char.classSpecific || {};
        char.classSpecific.animalCompanion = char.classSpecific.animalCompanion || {};
        char.classSpecific.animalCompanion[key] = value;
        Store.setCharacterProperty('classSpecific.animalCompanion', char.classSpecific.animalCompanion);
        this.updatePreview();
    },

    saveBase(index, config) {
        const char = Store.get('character');
        if (!char) return;
        char.classSpecific = char.classSpecific || {};
        const comp = char.classSpecific.animalCompanion = char.classSpecific.animalCompanion || {};
        const base = config.bases[index];
        comp.baseIndex = index;
        ['strengths', 'trainings', 'weaknesses'].forEach((f, i) => {
            const max = [base.ferocity, base.cunning, base.instinct][i];
            if (comp[f]?.length > max) comp[f] = comp[f].slice(0, max);
        });
        Store.setCharacterProperty('classSpecific.animalCompanion', comp);
        document.querySelectorAll('.animal-companion-step[data-field]').forEach(s => this.updateMultiUI(s, s.dataset.field, config));
        this.updatePreview();
    },

    updatePreview() {
        const preview = document.getElementById('animal-companion-preview');
        if (!preview) return;
        const saved = this.getSaved(), config = CLASS_RANGER?.animalCompanion;
        if (!config || !saved?.name || !saved?.species || saved?.baseIndex === undefined) {
            preview.innerHTML = '<div class="animal-companion-preview-empty"><span class="preview-icon">🐾</span><span class="preview-text">Configure seu companheiro abaixo</span></div>';
            return;
        }
        const base = config.bases[saved.baseIndex];
        const icons = { Lobo:'🐺', Puma:'🐆', Urso:'🐻', Águia:'🦅', Cachorro:'🐕', Falcão:'🦅', Gato:'🐈', Coruja:'🦉', Pombo:'🐦', Rato:'🐀', Mula:'🫏' };
        const tag = (arr, cls) => (arr || []).map(t => `<span class="companion-tag tag-${cls}">${t}</span>`).join('');
        preview.innerHTML = `<div class="companion-preview-header"><span class="companion-preview-icon">${icons[saved.species] || '🐾'}</span><div class="companion-preview-identity"><span class="companion-preview-name">${saved.name}</span><span class="companion-preview-species">${saved.species}</span></div></div>
            <div class="companion-preview-stats"><div class="companion-stat"><span class="stat-label">Ferocidade</span><span class="stat-value stat-ferocity">+${base.ferocity}</span></div><div class="companion-stat"><span class="stat-label">Astúcia</span><span class="stat-value stat-cunning">+${base.cunning}</span></div><div class="companion-stat"><span class="stat-label">Armadura</span><span class="stat-value stat-armor">${base.armor}</span></div><div class="companion-stat"><span class="stat-label">Instinto</span><span class="stat-value stat-instinct">+${base.instinct}</span></div></div>
            ${saved.strengths?.length ? `<div class="companion-preview-section"><span class="section-label">Forças:</span><div class="companion-tags">${tag(saved.strengths, 'strength')}</div></div>` : ''}
            <div class="companion-preview-section"><span class="section-label">Treinamentos:</span><div class="companion-tags"><span class="companion-tag tag-training tag-base">Humanoides</span>${tag(saved.trainings, 'training')}</div></div>
            ${saved.weaknesses?.length ? `<div class="companion-preview-section"><span class="section-label">Fraquezas:</span><div class="companion-tags">${tag(saved.weaknesses, 'weakness')}</div></div>` : ''}`;
    },

    getSaved(char = null) { return (char || Store.get('character'))?.classSpecific?.animalCompanion || null; },

    getStats(char = null) {
        const saved = this.getSaved(char), config = CLASS_RANGER?.animalCompanion;
        if (!saved || !config || saved.baseIndex === undefined) return null;
        const base = config.bases[saved.baseIndex];
        return { name: saved.name || 'Companheiro', species: saved.species || '', ferocity: base.ferocity, cunning: base.cunning, armor: base.armor, instinct: base.instinct, strengths: saved.strengths || [], trainings: ['Humanoides', ...(saved.trainings || [])], weaknesses: saved.weaknesses || [] };
    }
};

if (typeof window !== 'undefined') window.AnimalCompanion = AnimalCompanion;
