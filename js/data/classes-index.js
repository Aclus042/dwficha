/**
 * =====================================================
 * DUNGEON WORLD - ÍNDICE DE CLASSES
 * Registro central de todas as classes disponíveis
 * =====================================================
 */

const CLASSES = {
    barbaro: CLASS_BARBARO,
    bardo: CLASS_BARDO,
    clerigo: CLASS_CLERIGO,
    druida: CLASS_DRUIDA,
    guerreiro: CLASS_GUERREIRO,
    ladrao: CLASS_LADRAO,
    mago: CLASS_MAGO,
    paladino: CLASS_PALADINO,
    ranger: CLASS_RANGER
};

// Lista ordenada para exibição
const CLASS_LIST = [
    { id: 'barbaro', icon: '⚔️', color: '#8B3A3A' },
    { id: 'bardo', icon: '🎵', color: '#D46A9E' },
    { id: 'clerigo', icon: '✝️', color: '#9A9A9A' },
    { id: 'druida', icon: '🌿', color: '#4A7C4E' },
    { id: 'guerreiro', icon: '🛡️', color: '#6A5A4A' },
    { id: 'ladrao', icon: '🗝️', color: '#3A3A3A' },
    { id: 'mago', icon: '🔮', color: '#5BA3D6' },
    { id: 'paladino', icon: '⚜️', color: '#8B7A3A' },
    { id: 'ranger', icon: '🏹', color: '#5A7A5A' }
];

/**
 * Obtém uma classe pelo ID
 * @param {string} classId - ID da classe
 * @returns {Object|null} - Dados da classe ou null
 */
function getClassById(classId) {
    return CLASSES[classId] || null;
}

/**
 * Obtém todas as classes como array
 * @returns {Array} - Array de objetos de classe
 */
function getAllClasses() {
    return CLASS_LIST.map(item => ({
        ...item,
        ...CLASSES[item.id]
    }));
}

/**
 * Obtém os dados de exibição de uma classe
 * @param {string} classId - ID da classe
 * @returns {Object} - Dados de exibição
 */
function getClassDisplayData(classId) {
    const classData = CLASSES[classId];
    const listData = CLASS_LIST.find(c => c.id === classId);
    
    if (!classData || !listData) return null;
    
    return {
        id: classId,
        name: classData.name,
        description: classData.description,
        icon: listData.icon,
        color: listData.color,
        baseHP: classData.baseHP,
        baseDamage: classData.baseDamage,
        baseLoad: classData.baseLoad
    };
}

// Exporta para uso global
if (typeof window !== 'undefined') {
    window.CLASSES = CLASSES;
    window.CLASS_LIST = CLASS_LIST;
    window.getClassById = getClassById;
    window.getAllClasses = getAllClasses;
    window.getClassDisplayData = getClassDisplayData;
}
