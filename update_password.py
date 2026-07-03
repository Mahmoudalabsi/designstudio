#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════
  أداة تحديث كلمة المرور - مصمم الصور (نسخة Netlify)
═══════════════════════════════════════════════════════════════
  كلمة المرور الآن مُخزّنة في متغيرات البيئة على Netlify.
  هذا السكربت يولّد القيم المطلوبة (HASH, SALT, SECRET) لنسخها
  إلى لوحة تحكم Netlify.

  طريقة الاستخدام:
  ---------------
  1. لتغيير كلمة المرور (سيطلب منك إدخالها بأمان):
       python3 update_password.py

  2. لتوليد AUTH_SECRET فقط (سر توقيع التوكن):
       python3 update_password.py --secret

  3. لعرض كلمة المرور الحالية (التجزئة فقط):
       python3 update_password.py --show

  بعد تشغيل السكربت، انسخ القيم الناتجة إلى:
  Netlify Dashboard → Site settings → Environment variables
═══════════════════════════════════════════════════════════════
"""
import hashlib
import secrets
import sys
import os
from datetime import datetime
from getpass import getpass

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE = os.path.join(SCRIPT_DIR, 'auth-config.js')


def generate_salt():
    """توليد ملح عشوائي آمن بطول 32 بايت"""
    return secrets.token_hex(16)


def generate_secret():
    """توليد سر عشوائي آمن لتوقيع التوكن (48 حرف)"""
    return secrets.token_urlsafe(36)


def hash_password(password, salt):
    """توليد تجزئة SHA-256 لـ (salt + password)"""
    combined = salt + password
    return hashlib.sha256(combined.encode('utf-8')).hexdigest()


def show_current():
    """عرض الإعدادات الحالية من ملف auth-config.js"""
    print('═══════════════════════════════════════════════════════')
    print('  معلومات النظام الحالية')
    print('═══════════════════════════════════════════════════════\n')
    print('  كلمة المرور مُخزّنة في متغيرات البيئة على Netlify:')
    print('    • PASSWORD_HASH  : تجزئة SHA-256 لـ (SALT + PASSWORD)')
    print('    • PASSWORD_SALT  : الملح العشوائي')
    print('    • AUTH_SECRET    : سر توقيع توكن الجلسة')
    print()
    print('  لعرض/تعديل القيم:')
    print('    Netlify Dashboard → updateforeditor → Site settings')
    print('    → Environment variables')
    print()
    print('  ⚠️ لا يمكن استرجاع كلمة المرور الأصلية من التجزئة.')
    print('     إذا نسيتها، ستحتاج لتعيين قيم جديدة.')


def generate_secret_only():
    """توليد AUTH_SECRET فقط"""
    print('═══════════════════════════════════════════════════════')
    print('  توليد AUTH_SECRET لتوقيع توكن الجلسة')
    print('═══════════════════════════════════════════════════════\n')

    secret = generate_secret()
    print(f'  AUTH_SECRET = {secret}')
    print()
    print('  انسخ هذه القيمة إلى متغير البيئة AUTH_SECRET على Netlify.')


def main():
    print('═══════════════════════════════════════════════════════════')
    print('  أداة تحديث كلمة المرور - مصمم الصور (نسخة Netlify)')
    print('═══════════════════════════════════════════════════════════\n')

    if '--show' in sys.argv:
        show_current()
        return

    if '--secret' in sys.argv:
        generate_secret_only()
        return

    # الحصول على كلمة المرور الجديدة
    if len(sys.argv) > 1 and sys.argv[1] not in ('-h', '--help'):
        new_password = sys.argv[1]
    else:
        print('أدخل كلمة المرور الجديدة (لن تظهر الأحرف أثناء الكتابة):')
        new_password = getpass('  كلمة المرور: ')

        if not new_password:
            print('❌ كلمة المرور لا يمكن أن تكون فارغة')
            sys.exit(1)

        confirm = getpass('  تأكيد كلمة المرور: ')
        if new_password != confirm:
            print('❌ كلمتا المرور غير متطابقتين')
            sys.exit(1)

    if len(new_password) < 6:
        print('⚠️  تحذير: كلمة المرور قصيرة جداً (أقل من 6 أحرف)')
        proceed = input('هل تريد المتابعة؟ (y/N): ').strip().lower()
        if proceed != 'y':
            print('تم الإلغاء.')
            sys.exit(0)

    # توليد القيم
    new_salt = generate_salt()
    new_hash = hash_password(new_password, new_salt)
    new_secret = generate_secret()

    # عرض القيم للنسخ
    print('\n═══════════════════════════════════════════════════════════════════')
    print('  القيم الجديدة — انسخها إلى Netlify Environment Variables')
    print('═══════════════════════════════════════════════════════════════════\n')
    print(f'  PASSWORD_HASH  = {new_hash}')
    print(f'  PASSWORD_SALT  = {new_salt}')
    print(f'  AUTH_SECRET    = {new_secret}')
    print()
    print('═══════════════════════════════════════════════════════════════════')
    print('  التعليمات')
    print('═══════════════════════════════════════════════════════════════════\n')
    print('  1. افتح: https://app.netlify.com/projects/updateforeditor')
    print('     → Site settings → Environment variables')
    print()
    print('  2. أضف/حدّث المتغيرات الثلاثة بالقيم أعلاه:')
    print('     • PASSWORD_HASH  (القيمة الأولى)')
    print('     • PASSWORD_SALT  (القيمة الثانية)')
    print('     • AUTH_SECRET    (القيمة الثالثة)')
    print()
    print('  3. احفظ التغييرات، ثم أعد نشر الموقع:')
    print('     → Deploys → Trigger deploy → Deploy site')
    print()
    print('  4. ستسري كلمة المرور الجديدة فوراً بعد النشر.')
    print()
    print(f'  📝 كلمة المرور الجديدة: {"*" * len(new_password)} ({len(new_password)} حرف)')
    print(f'  🕐 التوقيت: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}')
    print()
    print('  ⚠️ احفظ كلمة المرور في مكان آمن. لا يمكن استرجاعها من التجزئة.')


if __name__ == '__main__':
    main()
