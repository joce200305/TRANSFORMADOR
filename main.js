const transformarPHPaJS = (codigo) => {
    if (!codigo.includes("<?php") || !codigo.includes("?>")) {
        return "Error: Código no válido, asegúrate de incluir '<?php' y '?>'.";
    } else if (!/\$\w+/.test(codigo)) {
        return "Error: No se encontraron variables PHP para transformar.";
    } else {
        return codigo
            .replace(/<\?php|<\?|\?>/g, '') // Eliminar etiquetas PHP
            .replace(/\$([a-zA-Z_]\w*)/g, 'let $1')             // Convertir las variables PHP a `let`
            .replace(/echo\s+(.+?);/g, (_, c) => {
                return `console.log(${c.replace(/\$([a-zA-Z_]\w*)/g, '${$1}')});`;
            })             // Cambiar `echo` para que use `console.log`
            .replace(/console\.log\(\s*let\s+/g, 'console.log(')  // Eliminar `let` en console.log
            .replace(/return\s+let\s+/g, 'return ') // Quita `let` en `return`
            .replace(/return\s+(\w+)\s+\+\s+let\s+(\w+)/g, 'return $1 + $2') // Sumas en `return`
            .trim() || "No se detectaron elementos transformables.";
    }
};

const obtenerElemento = (id) => document.getElementById(id);
const manejarClick = (id, callback) => obtenerElemento(id).addEventListener('click', callback);

manejarClick('transformar', () => {
    const codigoPHP = obtenerElemento('inputPHP').value.trim();
    obtenerElemento('outputJS').textContent = codigoPHP
        ? transformarPHPaJS(codigoPHP)
        : "Error: Ingresa código PHP.";
});

manejarClick('limpiar', () => {
    ['inputPHP', 'outputJS'].forEach(id => obtenerElemento(id).value = obtenerElemento(id).textContent = '');
});

manejarClick('seleccionar', () => {
    const output = obtenerElemento('outputJS');
    if (output.textContent.trim()) {
        const range = document.createRange();
        range.selectNodeContents(output);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    } else {
        alert("No hay código para seleccionar.");
    }
});
