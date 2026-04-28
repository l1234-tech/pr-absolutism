// docs/scripts/mermaid-zoom.js

document$.subscribe(function() {
    // Находим все диаграммы Mermaid на странице
    const mermaidElements = document.querySelectorAll(".mermaid");
    
    mermaidElements.forEach(function(element) {
        // Проверяем, не был ли уже применен зум (чтобы не дублировать при обновлении)
        if (!element._panzoom) {
            // Оборачиваем диаграмму в контейнер для зума, если нужно, 
            // но panzoom умеет работать и напрямую с элементом, 
            // однако для меридиана лучше применять к SVG внутри.
            
            // Ждем немного, пока Mermaid отрисует SVG
            setTimeout(() => {
                const svg = element.querySelector("svg");
                if (svg) {
                    // Добавляем курсор "хватания"
                    svg.style.cursor = "grab";
                    
                    // Инициализируем Panzoom
                    const panzoomInstance = Panzoom(svg, {
                        maxScale: 5,      // Максимальное приближение (500%)
                        minScale: 0.5,    // Минимальное отдаление (50%)
                        contain: "outside", // Не давать улетать схеме слишком далеко
                        startScale: 1     // Начальный масштаб
                    });

                    // Добавляем прокрутку колесиком мыши
                    // Важно: добавляем слушатель на родительский элемент или сам SVG
                    svg.parentElement.addEventListener("wheel", panzoomInstance.zoomWithWheel);
                    
                    // Сохраняем ссылку, чтобы не создавать дубликаты
                    element._panzoom = true;
                    
                    // При клике сбрасываем зум (опционально)
                    // svg.addEventListener("click", () => panzoomInstance.reset());
                }
            }, 100); // Небольшая задержка, чтобы Mermaid успел отрисоваться
        }
    });
});