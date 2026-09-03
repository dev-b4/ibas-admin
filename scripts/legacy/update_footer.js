import fs from 'fs';

const path = 'src/components/Footer.jsx';
let content = fs.readFileSync(path, 'utf8');

// Fix the typo
content = content.replace(
  "Índice de {t('footer.sustainableAssets')}",
  "{t('footer.index')}"
);

// Add the two new links
const newLinks = `                  <li>
                    <a href="/#/" className="hover:text-white transition-colors">
                      {t('footer.ibasLink')}
                    </a>
                  </li>
                  <li>
                    <a href="/#/" className="hover:text-white transition-colors">
                      {t('footer.projectScoreLink')}
                    </a>
                  </li>
                </ul>`;

content = content.replace('                </ul>', newLinks);

fs.writeFileSync(path, content);
