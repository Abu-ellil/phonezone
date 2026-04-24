#!/usr/bin/env python3
"""
سكريبت لرفع صور المنتجات إلى Cloudinary دفعة واحدة
"""

import os
import requests
from pathlib import Path
import hashlib
import time

# ============================================
# إعدادات Cloudinary - قم بتعبئتها
# ============================================
CLOUD_NAME = "masoft"
API_KEY = "657846754332939"
API_SECRET = "Jsg7AiP68YfIr74PmFwIP7T5YF8"

# ============================================
# مجلد الصور
# ============================================
IMAGES_FOLDER = Path("public/images/products")  # غيره لمجلد الصور عندك

# ============================================
# دالة رفع صورة واحدة
# ============================================
def upload_image(image_path):
    """
    رفع صورة إلى Cloudinary باستخدام signed upload
    """
    url = f"https://api.cloudinary.com/v1_1/{CLOUD_NAME}/image/upload"

    try:
        with open(image_path, 'rb') as file:
            # قراءة الملف
            file_content = file.read()

            # إعداد البيانات
            timestamp = int(time.time())
            params = {
                'timestamp': str(timestamp),
                'folder': 'products',
                'transformation': 'q_auto,f_auto'
            }

            # إنشاء التوقيع
            params_str = '&'.join([f'{k}={v}' for k, v in sorted(params.items())])
            sign_data = f'{params_str}{API_SECRET}'
            signature = hashlib.sha1(sign_data.encode()).hexdigest()

            # إضافة بيانات API
            data = {
                **params,
                'api_key': API_KEY,
                'signature': signature,
                'file': file_content
            }

            response = requests.post(url, files={'file': file_content}, data=data)

            if response.status_code == 200:
                result = response.json()
                print(f"✅ تم رفع: {image_path.name}")
                print(f"   الرابط: {result['secure_url']}")
                return result['secure_url']
            else:
                print(f"❌ فشل رفع: {image_path.name}")
                print(f"   الخطأ: {response.text}")
                return None

    except Exception as e:
        print(f"❌ استثناء: {image_path.name} - {e}")
        return None

# ============================================
# دالة رفع جميع الصور
# ============================================
def upload_all_images():
    """
    رفع جميع الصور من المجلد
    """
    # تأكد من وجود المجلد
    if not IMAGES_FOLDER.exists():
        print(f"❌ المجلد غير موجود: {IMAGES_FOLDER}")
        print("   قم بإنشاء المجلد ووضع الصور بداخله")
        return

    # الحصول على جميع الصور
    image_extensions = ['.jpg', '.jpeg', '.png', '.webp']
    images = [
        f for f in IMAGES_FOLDER.iterdir()
        if f.suffix.lower() in image_extensions
    ]

    if not images:
        print(f"❌ لا توجد صور في: {IMAGES_FOLDER}")
        return

    print(f"📸 وجدت {len(images)} صورة")
    print("=" * 50)

    # رفع الصور واحدة تلو الأخرى
    uploaded_urls = []
    for image in images:
        url = upload_image(image)
        if url:
            uploaded_urls.append(url)

    # حفظ الروابط في ملف
    if uploaded_urls:
        save_urls_to_file(uploaded_urls)
        print("=" * 50)
        print(f"✅ تم رفع {len(uploaded_urls)} من {len(images)} صورة بنجاح!")
    else:
        print("❌ لم يتم رفع أي صورة")

# ============================================
# حفظ الروابط في ملف
# ============================================
def save_urls_to_file(urls):
    """
    حفظ روابط الصور في ملف نصي
    """
    output_file = Path("uploaded-images-urls.txt")

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("# روابط الصور المرفوعة إلى Cloudinary\n")
        f.write("# يمكنك نسخ هذه الروابط مباشرة في بيانات المنتجات\n\n")

        for i, url in enumerate(urls, 1):
            f.write(f"صورة {i}:\n")
            f.write(f"{url}\n\n")

    print(f"\n💾 تم حفظ الروابط في: {output_file}")

# ============================================
# الرئيسي
# ============================================
if __name__ == "__main__":
    print("🚀 سكريبت رفع الصور إلى Cloudinary")
    print("=" * 50)

    # تأكد من تعبئة الإعدادات
    if CLOUD_NAME == "YOUR_CLOUD_NAME" or API_KEY == "" or API_SECRET == "":
        print("⚠️  تحذير: لم تقم بتعديل بيانات Cloudinary")
        print("   قم بتعديل الملف وأضف بياناتك من Cloudinary Dashboard")
        print("\n📖 كيفية الحصول على البيانات:")
        print("   1. سجل في cloudinary.com")
        print("   2. من Dashboard، ستجد Cloud Name, API Key, API Secret")
        print("   3. انسخها وضعها في المتغيرات في أعلى الملف")
        exit(1)

    # بدء الرفع
    upload_all_images()
