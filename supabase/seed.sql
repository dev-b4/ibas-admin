-- Basic mock data for 7-8 projects
INSERT INTO projects (id, name, description, score) VALUES 
('11111111-1111-1111-1111-111111111111', 'Arace', 'Projeto Arace', 85.5),
('22222222-2222-2222-2222-222222222222', 'Apoena', 'Projeto Apoena', 92.0),
('33333333-3333-3333-3333-333333333333', 'Yaku', 'Projeto Yaku', 78.3),
('44444444-4444-4444-4444-444444444444', 'Consultas', 'Projeto Consultas', 88.9),
('55555555-5555-5555-5555-555555555555', 'Tonca', 'Projeto Tonca', 95.1),
('66666666-6666-6666-6666-666666666666', 'Dowedi', 'Projeto Dowedi', 81.4),
('77777777-7777-7777-7777-777777777777', 'NFTs', 'Projeto NFTs', 73.2);

INSERT INTO evidences (project_id, title, description) VALUES
('11111111-1111-1111-1111-111111111111', 'Licença Ambiental', 'Documento de licença do projeto Arace'),
('22222222-2222-2222-2222-222222222222', 'Relatório de Sustentabilidade', 'Relatório anual Apoena');
