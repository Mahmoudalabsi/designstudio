#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════
  أداة تحديث كلمة المرور - مصمم الصور
═══════════════════════════════════════════════════════════════
  هذا السكربت يحدّث كلمة المرور العامة في "قاعدة البيانات"
  (ملف auth-config.js) مباشرةً، دون الحاجة لأي صفحة ويب.

  طريقة الاستخدام:
  ---------------
  1. لتغيير كلمة المرور (سيطلب منك إدخالها بأمان):
       python3 update_password.py

  2. لتغيير كلمة المرور مباشرة كوسيط:
       python3 update_password.py "كلمة-المرور-الجديدة"

  3. لعرض كلمة المرور الحالية (التجزئة فقط):
       python3 update_password.py --show

  ملاحظات أمنية:
  - كلمة المرور لا تُخزَّن كنص واضح أبداً
  - يتم تخزين تجزئة SHA-256 مع ملح (salt) عشوائي
  - كل تغيير يولّد ملحاً جديداً لمنع هجمات إعادة الاستخدام
═══════════════════════════════════════════════════════════════
"""
import hashlib
import secrets
import re
import sys
import os
import json
from datetime import datetime
from getpass import getpass

# المسار لملف قاعدة البيانات (auth-config.js)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE = os.path.join(SCRIPT_DIR, 'auth-config.js')


def generate_salt():
    """توليد ملح عشوائي آمن بطول 32 بايت"""
    return secrets.token_hex(16)


def hash_password(password, salt):
    """توليد تجزئة SHA-256 لـ (salt + password)"""
    combined = salt + password
    return hashlib.sha256(combined.encode('utf-8')).hexdigest()


def update_config_file(new_hash, new_salt):
    """تحديث ملف auth-config.js بالتجزئة والملح الجديدين"""
    if not os.path.exists(CONFIG_FILE):
        print(f'❌ خطأ: ملف التكوين غير موجود في: {CONFIG_FILE}')
        sys.exit(1)

    with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    # استبدال قيم passwordHash و salt
    new_content = re.sub(
        r"passwordHash:\s*'[a-f0-9]+'",
        f"passwordHash: '{new_hash}'",
        content
    )
    new_content = re.sub(
        r"salt:\s*'[^']+'",
        f"salt: '{new_salt}'",
        new_content
    )

    # التحقق من حدوث التغيير
    if new_content == content:
        print('⚠️  تحذير: لم يتم العثور على القيم لاستبدالها. تحقق من تنسيق ملف auth-config.js')
        sys.exit(1)

    with open(CONFIG_FILE, 'w', encoding='utf-8') as f:
        f.write(new_content)


def show_current():
    """عرض التجزئة الحالية من ملف التكوين"""
    if not os.path.exists(CONFIG_FILE):
        print(f'❌ ملف التكوين غير موجود: {CONFIG_FILE}')
        return

    with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    hash_match = re.search(r"passwordHash:\s*'([a-f0-9]+)'", content)
    salt_match = re.search(r"salt:\s*'([^']+)'", content)

    print('═══ معلومات كلمة المرور الحالية ═══')
    print(f'  التجزئة (Hash) : {hash_match.group(1) if hash_match else "غير موجودة"}')
    print(f'  الملح (Salt)   : {salt_match.group(1) if salt_match else "غير موجود"}')
    print('  (لا يمكن استرجاع كلمة المرور الأصلية من التجزئة)')
    print()


def main():
    print('═══════════════════════════════════════════════════════════')
    print('  أداة تحديث كلمة المرور - مصمم الصور')
    print('═══════════════════════════════════════════════════════════\n')

    # وضع العرض
    if '--show' in sys.argv:
        show_current()
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

        # تأكيد كلمة المرور
        confirm = getpass('  تأكيد كلمة المرور: ')
        if new_password != confirm:
            print('❌ كلمتا المرور غير متطابقتين')
            sys.exit(1)

    # التحقق من قوة كلمة المرور
    if len(new_password) < 6:
        print('⚠️  تحذير: كلمة المرور قصيرة جداً (أقل من 6 أحرف)')
        proceed = input('هل تريد المتابعة؟ (y/N): ').strip().lower()
        if proceed != 'y':
            print('تم الإلغاء.')
            sys.exit(0)

    # توليد ملح جديد وتجزئة
    new_salt = generate_salt()
    new_hash = hash_password(new_password, new_salt)

    # عرض معلومات قبل الحفظ
    print('\n═══ ملخص التغيير ═══')
    print(f'  كلمة المرور الجديدة : {"*" * len(new_password)} ({len(new_password)} حرف)')
    print(f'  الملح الجديد (Salt) : {new_salt}')
    print(f'  التجزئة (Hash)      : {new_hash}')
    print(f'  ملف قاعدة البيانات  : {CONFIG_FILE}')
    print(f'  التوقيت             : {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}\n')

    # طلب التأكيد
    confirm_save = input('هل تريد حفظ التغييرات في قاعدة البيانات؟ (y/N): ').strip().lower()
    if confirm_save != 'y':
        print('تم الإلغاء. لم يتم حفظ أي تغييرات.')
        sys.exit(0)

    # تحديث الملف
    try:
        update_config_file(new_hash, new_salt)
        print('\n✅ تم تحديث كلمة المرور بنجاح في قاعدة البيانات!')
        print(f'   الملف: {CONFIG_FILE}')
        print('\n📝 الخطوات التالية:')
        print('   1. ارفع التغييرات إلى GitHub: git push origin main')
        print('   2. ستسري كلمة المرور الجديدة فوراً على الموقع')
        print('   3. ستحتاج لاستخدام كلمة المرور الجديدة في تسجيل الدخول التالي')
    except Exception as e:
        print(f'\n❌ خطأ أثناء التحديث: {e}')
        sys.exit(1)


if __name__ == '__main__':
    main()
