#!/usr/bin/env python3
"""Ставит улучшенные фото на сайт.

Как пользоваться:
1. Положите файлы, которые вернул ChatGPT (или другой апскейлер), в папку
   Работа/Люмен/_улучшенные/  (подпапки не нужны).
2. Из папки Работа/Люмен запустите:  python3 _build/apply-upscaled.py
3. Скрипт сам найдёт, какому фото соответствует файл (по имени, суффикс -hd не мешает),
   сохранит его в assets/img/ (JPEG, до 2600 px по длинной стороне), обновит размеры
   и пересоберёт страницы.
Исходные (старые) фото при замене копируются в _для-улучшения/_старые/.
"""
import json, os, re, shutil, subprocess, sys
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
INP = os.path.join(ROOT, '_улучшенные')
IMG = os.path.join(ROOT, 'assets', 'img')
OLD = os.path.join(ROOT, '_для-улучшения', '_старые')
MAXSIDE = 2600

if not os.path.isdir(INP):
    sys.exit('Нет папки _улучшенные. Создайте её и положите туда файлы.')

done, skipped = [], []
for name in sorted(os.listdir(INP)):
    base, ext = os.path.splitext(name)
    if ext.lower() not in ('.jpg', '.jpeg', '.png', '.webp'):
        continue
    key = re.sub(r'[-_ ]?(hd|upscaled|enhanced)$', '', base, flags=re.I)  # works__hair-01-hd -> works__hair-01
    rel = key.replace('__', '/') + '.jpg'
    target = os.path.join(IMG, rel)
    if not os.path.exists(target):
        skipped.append(name)
        continue
    os.makedirs(OLD, exist_ok=True)
    backup = os.path.join(OLD, rel.replace('/', '__'))
    if not os.path.exists(backup):
        shutil.copy(target, backup)
    im = Image.open(os.path.join(INP, name)).convert('RGB')
    if max(im.size) > MAXSIDE:
        im.thumbnail((MAXSIDE, MAXSIDE), Image.LANCZOS)
    im.save(target, quality=88, optimize=True, progressive=True)
    done.append((rel, im.size))

# размеры для атрибутов width/height
sizes_path = os.path.join(IMG, 'sizes.json')
sizes = json.load(open(sizes_path))
for rel, (w, h) in done:
    sizes[rel] = [w, h]
json.dump(sizes, open(sizes_path, 'w'))

for rel, s in done:
    print('ок ', rel, s)
for n in skipped:
    print('?? не нашёл, к какому фото относится:', n)
if done:
    subprocess.run(['node', os.path.join(ROOT, '_build', 'build.mjs')], cwd=ROOT, check=True)
print('Готово: заменено %d, пропущено %d' % (len(done), len(skipped)))
