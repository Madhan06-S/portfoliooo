/**
 * Studio Content Data
 * 
 * This file contains all content items for the Studio monitor tower.
 * Each item will be displayed on a monitor in the tower.
 * 
 * Platforms: 'youtube', 'blog', 'tiktok'
 */

export const PLATFORM_CONFIG = {
    youtube: {
        color: '#FF0000',
        accentColor: '#cc0000',
        icon: '▶',
        label: 'YouTube',
        shape: 'tv', // Wide CRT style
    },
    blog: {
        color: '#4A90D9',
        accentColor: '#2d6cb5',
        icon: '📝',
        label: 'Blog',
        shape: 'monitor', // Thin desktop monitor
    },
    tiktok: {
        color: '#00F2EA',
        accentColor: '#FF0050',
        icon: '🎵',
        label: 'TikTok',
        shape: 'phone', // Vertical phone
    },
};

// Sample content data - replace with real content later
const RAW_CONTENT_DATA = [
    // ============ YouTube Videos ============
    {
        id: 'yt-001',
        platform: 'youtube',
        title: 'Building Neuro Grid: Visualizing Neural Networks in 3D',
        description: 'Exploring how neural net activations, weights, and bias parameters can be visualized interactively in the browser using React Three Fiber.',
        frontTexture: '/textures/studio/tvfront_filmikprojektdlamultiego.webp',
        paintedFrontTexture: '/textures/studio/tvfront_filmikprojektdlamultiego_painted.webp',
        thumbnail: null,
        url: 'https://github.com/Madhan06-S',
        date: '2026-01-10',
        views: '1.2K',
        duration: '15:32',
    },
    {
        id: 'yt-002',
        platform: 'youtube',
        title: 'Jarvis AI Voice Assistant Demonstration',
        description: 'A walk through of my custom voice assistant Jarvis, showing how it responds to voice commands, handles home integrations, and queries LLMs.',
        frontTexture: '/textures/studio/tvfront_filmikedytowaniezdjec.webp',
        paintedFrontTexture: '/textures/studio/tvfront_filmikedytowaniezdjec_painted.webp',
        thumbnail: null,
        url: 'https://github.com/Madhan06-S',
        date: '2025-10-11',
        views: '121',
        duration: '7:45',
    },
    {
        id: 'yt-003',
        platform: 'youtube',
        title: 'Smart Agricultural Insurance System Walkthrough',
        description: 'Demo of how the AI system uses convolutional neural networks to identify crop stress and automatically trigger insurance claims.',
        thumbnail: null,
        url: 'https://github.com/Madhan06-S',
        date: '2025-12-28',
        views: '2.4K',
        duration: '22:10',
    },
    {
        id: 'yt-004',
        platform: 'youtube',
        title: 'Computer Vision with OpenCV and YOLOv8',
        description: 'Quick crash course on training custom YOLOv8 models for real-time security surveillance and vehicle tracking.',
        thumbnail: null,
        url: 'https://github.com/Madhan06-S',
        date: '2025-12-15',
        views: '1.8K',
        duration: '18:33',
    },
    {
        id: 'yt-005',
        platform: 'youtube',
        title: 'Vite + Three.js Portfolio Performance Optimization',
        description: 'How to handle texture preloading, instanced mesh rendering, and responsive WebGL design in R3F.',
        thumbnail: null,
        url: 'https://github.com/Madhan06-S',
        date: '2025-12-01',
        views: '3.1K',
        duration: '20:15',
    },
    {
        id: 'yt-006',
        platform: 'youtube',
        title: 'Bird Sound Classification using CNNs',
        description: 'Converting bird songs into spectrograms and training deep learning models in TensorFlow for species identification.',
        thumbnail: null,
        url: 'https://github.com/Madhan06-S',
        date: '2025-11-20',
        views: '2.8K',
        duration: '25:00',
    },
    {
        id: 'yt-007',
        platform: 'youtube',
        title: 'FastAPI + React Full Stack Project Setup',
        description: 'Structuring FastAPI backends with PostgreSQL and connecting them to modern React frontends with Tailwind.',
        thumbnail: null,
        url: 'https://github.com/Madhan06-S',
        date: '2025-11-10',
        views: '1.5K',
        duration: '30:22',
    },
    {
        id: 'yt-008',
        platform: 'youtube',
        title: 'Google Earth Engine & Satellite Data Analysis',
        description: 'Using Python and Google Earth Engine to analyze historical vegetation indices (NDVI) for agriculture.',
        thumbnail: null,
        url: 'https://github.com/Madhan06-S',
        date: '2025-10-28',
        views: '1.9K',
        duration: '18:45',
    },

    // ============ Blog Posts ============
    {
        id: 'blog-001',
        platform: 'blog',
        title: 'My Developer Journey: From Medical Dreams to AI',
        description: 'I dreamed of becoming a doctor, but financial circumstances led me to Artificial Intelligence and Data Science. What started as an unexpected path became my absolute passion...',
        frontTexture: '/textures/studio/monitorfront_postnafbdoublewinner.webp',
        paintedFrontTexture: '/textures/studio/monitorfront_postnafbdoublewinner_painted.webp',
        thumbnail: null,
        url: 'https://github.com/Madhan06-S',
        date: '2026-01-08',
        readTime: '5 min',
    },
    {
        id: 'blog-002',
        platform: 'blog',
        title: 'Building AI-Powered Education for Students',
        description: 'My long-term mission is to build intelligent, accessible educational tools that help students from middle-class and underprivileged backgrounds achieve their academic dreams.',
        thumbnail: null,
        url: 'https://github.com/Madhan06-S',
        date: '2025-12-20',
        readTime: '8 min',
    },
    {
        id: 'blog-003',
        platform: 'blog',
        title: 'Smart Agricultural Insurance System: AI for Farms',
        description: 'An in-depth article describing how computer vision, drone surveys, and satellite data can automate claim settlements and protect crop growers from financial losses.',
        thumbnail: null,
        url: 'https://github.com/Madhan06-S',
        date: '2025-12-10',
        readTime: '6 min',
    },
    {
        id: 'blog-004',
        platform: 'blog',
        title: 'Neuro Grid: Designing a 3D Interactive Brain',
        description: 'How I designed a visual playground to understand deep learning parameters and neural weights interactively.',
        thumbnail: null,
        url: 'https://github.com/Madhan06-S',
        date: '2025-11-25',
        readTime: '10 min',
    },
    {
        id: 'blog-005',
        platform: 'blog',
        title: 'Building Jarvis: Voice Assistants with LLMs',
        description: 'A deep dive into local LLM function calling, speech processing, and text-to-speech pipelines for customized assistance.',
        thumbnail: null,
        url: 'https://github.com/Madhan06-S',
        date: '2025-11-15',
        readTime: '7 min',
    },
    {
        id: 'blog-006',
        platform: 'blog',
        title: 'CovaiCars: Architecting a Modern Car Rental Platform',
        description: 'Lessons learned from designing reservation logic, car inventory management, and smooth payment integrations.',
        thumbnail: null,
        url: 'https://github.com/Madhan06-S',
        date: '2025-11-01',
        readTime: '12 min',
    },
    {
        id: 'blog-007',
        platform: 'blog',
        title: 'Computer Vision in Smart City Surveillance',
        description: 'Implementing multi-camera tracking, edge YOLOv8 detection, and cloud notifications for smart school security.',
        thumbnail: null,
        url: 'https://github.com/Madhan06-S',
        date: '2025-10-20',
        readTime: '9 min',
    },
    {
        id: 'blog-008',
        platform: 'blog',
        title: 'Spectrogram Analysis for Wildlife Conservation',
        description: 'How we classified rare bird species by building deep neural network classifiers on audio spectrogram signals.',
        thumbnail: null,
        url: 'https://github.com/Madhan06-S',
        date: '2025-10-10',
        readTime: '6 min',
    },

    // ============ TikToks ============
    {
        id: 'tt-001',
        platform: 'tiktok',
        title: 'Follow my journey on GitHub! ✨',
        description: 'Explore my latest AI, WebGL, and Full-Stack open source repositories.',
        frontTexture: '/textures/studio/phonefront_followmeontiktok.webp',
        paintedFrontTexture: '/textures/studio/phonefront_followmeontiktok_painted.webp',
        thumbnail: null,
        url: 'https://github.com/Madhan06-S',
        date: '2026-01-09',
        views: '15.2K',
        likes: '1.2K',
    },
    {
        id: 'tt-002',
        platform: 'tiktok',
        title: 'Surveillance camera goes smart 📹',
        description: 'YOLOv8 tracking test results in real-time!',
        thumbnail: null,
        url: 'https://github.com/Madhan06-S',
        date: '2026-01-03',
        views: '8.5K',
        likes: '756',
    },
    {
        id: 'tt-003',
        platform: 'tiktok',
        title: 'Coding Jarvis voice response 🎙️',
        description: 'Testing local TTS synthesis with Python!',
        thumbnail: null,
        url: 'https://github.com/Madhan06-S',
        date: '2025-12-25',
        views: '22.1K',
        likes: '3.4K',
    },
    {
        id: 'tt-004',
        platform: 'tiktok',
        title: 'When the loss curve looks perfect 📈',
        description: 'The satisfaction of model training converging.',
        thumbnail: null,
        url: 'https://github.com/Madhan06-S',
        date: '2025-12-18',
        views: '12.3K',
        likes: '1.1K',
    },
    {
        id: 'tt-005',
        platform: 'tiktok',
        title: 'Agriculture meets Computer Vision 🌾',
        description: 'Segmenting crops from drone footage using CNNs.',
        thumbnail: null,
        url: 'https://github.com/Madhan06-S',
        date: '2025-12-12',
        views: '45.2K',
        likes: '5.8K',
    },
    {
        id: 'tt-006',
        platform: 'tiktok',
        title: 'B.Tech AI & Data Science Student Life 🎓',
        description: 'Balancing college projects, internships, and hackathons.',
        thumbnail: null,
        url: 'https://github.com/Madhan06-S',
        date: '2025-12-05',
        views: '18.7K',
        likes: '2.1K',
    },
    {
        id: 'tt-007',
        platform: 'tiktok',
        title: 'Three.js custom shaders are magic ✨',
        description: 'Brush-stroke reveals on 3D objects in the browser.',
        thumbnail: null,
        url: 'https://github.com/Madhan06-S',
        date: '2025-11-28',
        views: '33.4K',
        likes: '4.2K',
    },
    {
        id: 'tt-008',
        platform: 'tiktok',
        title: 'Designing Neuro Grid in Figma 🎨',
        description: 'Crafting the ultimate user interface for neural networks.',
        thumbnail: null,
        url: 'https://github.com/Madhan06-S',
        date: '2025-11-20',
        views: '28.9K',
        likes: '3.6K',
    },
    {
        id: 'tt-009',
        platform: 'tiktok',
        title: 'FastAPI + React user registration flow 🔐',
        description: 'Securing user authentication in minutes.',
        thumbnail: null,
        url: 'https://github.com/Madhan06-S',
        date: '2025-11-15',
        views: '19.3K',
        likes: '2.4K',
    },
    {
        id: 'tt-010',
        platform: 'tiktok',
        title: 'Classification of bird songs 🎵',
        description: 'Audio spectrogram CNN training demo.',
        thumbnail: null,
        url: 'https://github.com/Madhan06-S',
        date: '2025-11-08',
        views: '41.2K',
        likes: '5.1K',
    },
    {
        id: 'tt-011',
        platform: 'tiktok',
        title: 'Full Stack Intern at CodeAlpha 💼',
        description: 'Building production-ready react dashboards.',
        thumbnail: null,
        url: 'https://github.com/Madhan06-S',
        date: '2025-11-01',
        views: '25.6K',
        likes: '3.0K',
    },
    {
        id: 'tt-012',
        platform: 'tiktok',
        title: 'Top 10 at DELTABUILD Hackathon! 🏆',
        description: 'Presenting our AI insurance solution to the judges.',
        thumbnail: null,
        url: 'https://github.com/Madhan06-S',
        date: '2025-10-25',
        views: '31.8K',
        likes: '4.0K',
    },
];

const ytTextures = ['/textures/studio/tvfront_filmikprojektdlamultiego.webp', '/textures/studio/tvfront_filmikedytowaniezdjec.webp'];
const ytPaintedTextures = ['/textures/studio/tvfront_filmikprojektdlamultiego_painted.webp', '/textures/studio/tvfront_filmikedytowaniezdjec_painted.webp'];
const blogTextures = ['/textures/studio/monitorfront_postnafbdoublewinner.webp'];
const blogPaintedTextures = ['/textures/studio/monitorfront_postnafbdoublewinner_painted.webp'];
const ttTextures = ['/textures/studio/phonefront_followmeontiktok.webp'];
const ttPaintedTextures = ['/textures/studio/phonefront_followmeontiktok_painted.webp'];

let ytIdx = 0, blogIdx = 0, ttIdx = 0;
let ytPIdx = 0, blogPIdx = 0, ttPIdx = 0;

export const CONTENT_DATA = RAW_CONTENT_DATA.map((item) => {
    return {
        ...item,
        frontTexture: item.frontTexture || (
            item.platform === 'youtube' ? ytTextures[ytIdx++ % ytTextures.length] :
                item.platform === 'blog' ? blogTextures[blogIdx++ % blogTextures.length] :
                    ttTextures[ttIdx++ % ttTextures.length]
        ),
        paintedFrontTexture: item.paintedFrontTexture || (
            item.platform === 'youtube' ? ytPaintedTextures[ytPIdx++ % ytPaintedTextures.length] :
                item.platform === 'blog' ? blogPaintedTextures[blogPIdx++ % blogPaintedTextures.length] :
                    ttPaintedTextures[ttPIdx++ % ttPaintedTextures.length]
        )
    };
});

// Helper to get content by platform
export const getContentByPlatform = (platform) => {
    if (platform === 'all') return CONTENT_DATA;
    return CONTENT_DATA.filter(item => item.platform === platform);
};

// Get latest content (for "On Air" indicator)
export const getLatestContent = () => {
    return [...CONTENT_DATA].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
};
