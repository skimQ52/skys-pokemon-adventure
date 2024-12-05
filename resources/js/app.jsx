import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        // Import both .tsx and .jsx files dynamically
        const pages = import.meta.glob('./Pages/**/*.tsx');
        const jsxPages = import.meta.glob('./Pages/**/*.jsx');

        console.log(pages);
        console.log(jsxPages);
        // Check if the .tsx file exists, if not, try the .jsx file
        const pageFile = pages[`./Pages/${name}.tsx`] || jsxPages[`./Pages/${name}.jsx`];
        if (!pageFile) {
            throw new Error(`Page not found: ./Pages/${name}.tsx or ./Pages/${name}.jsx`);
        }
        console.log(pageFile);

        return pageFile(); // Return the page component
    },
    // resolve: (name) =>
    //     resolvePageComponent(
    //         `./Pages/${name}.jsx`,
    //         import.meta.glob('./Pages/**/*.jsx'),
    //     ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
