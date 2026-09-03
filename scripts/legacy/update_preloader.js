import fs from 'fs';

const path = 'src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

const imageHtml = `        className="flex items-center justify-center"
      >
        <img src="/ibas logo.png" alt="IBAS Logo" className="w-32 md:w-48 object-contain" />
      </motion.div>`;

content = content.replace(
  `        className="text-white text-5xl font-extrabold tracking-tighter flex items-center justify-center gap-1"
      >
        IBAS
        <span className="text-sm font-semibold tracking-normal text-[#7C2DFF] mt-1 relative -top-2">B4</span>
      </motion.div>`,
  imageHtml
);

fs.writeFileSync(path, content);
