"""
Script để thêm dữ liệu mẫu cho Coffee Shop
Chạy: python seed_data.py
"""

from database import SessionLocal,Base
from models.product import Product

def seed_products():
    db = SessionLocal()
    
    try:
        # Kiểm tra xem đã có sản phẩm chưa
        existing_products = db.query(Product).count()
        if existing_products > 0:
            print(f"Đã có {existing_products} sản phẩm. Bỏ qua seed data.")
            return
        
        products = [
            Product(
                name="Espresso",
                description="Cà phê đậm đà, thơm ngon với vị đắng nhẹ, perfect cho buổi sáng",
                price=35000,
                image_url="https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400",
                category="Espresso",
                in_stock=True,
                stock_quantity=50
            ),
            Product(
                name="Cappuccino",
                description="Espresso kết hợp với sữa nóng và lớp bọt sữa mịn màng",
                price=45000,
                image_url="https://images.unsplash.com/photo-1572442384236-ec0e3a8b8c21?w=400",
                category="Cappuccino",
                in_stock=True,
                stock_quantity=40
            ),
            Product(
                name="Latte",
                description="Espresso với lượng sữa nóng nhiều hơn, vị ngọt ngào và mềm mại",
                price=50000,
                image_url="https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400",
                category="Latte",
                in_stock=True,
                stock_quantity=45
            ),
            Product(
                name="Americano",
                description="Espresso pha loãng với nước nóng, vị đậm đà nhưng nhẹ nhàng hơn",
                price=40000,
                image_url="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400",
                category="Americano",
                in_stock=True,
                stock_quantity=35
            ),
            Product(
                name="Mocha",
                description="Latte kết hợp với sô cô la, vị ngọt ngào và thơm ngon",
                price=55000,
                image_url="https://images.unsplash.com/photo-1570970889842-8b11dd71c81c?w=400",
                category="Mocha",
                in_stock=True,
                stock_quantity=30
            ),
            Product(
                name="Frappuccino",
                description="Cà phê đá xay mát lạnh, perfect cho mùa hè",
                price=60000,
                image_url="https://images.unsplash.com/photo-1461023058943-07fbeaa89384?w=400",
                category="Frappuccino",
                in_stock=True,
                stock_quantity=25
            ),
            Product(
                name="Macchiato",
                description="Espresso với một chút sữa, vị đậm đà và tinh tế",
                price=42000,
                image_url="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
                category="Espresso",
                in_stock=True,
                stock_quantity=20
            ),
            Product(
                name="Cappuccino Caramel",
                description="Cappuccino với sốt caramel, vị ngọt ngào và đặc biệt",
                price=52000,
                image_url="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400",
                category="Cappuccino",
                in_stock=True,
                stock_quantity=30
            ),
            # Hạt cà phê
            Product(
                name="Hạt Cà Phê Arabica Premium",
                description="Hạt cà phê Arabica chất lượng cao, vị ngọt nhẹ, hương thơm đậm đà từ vùng Tây Nguyên",
                price=250000,
                image_url="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
                category="Coffee Beans",
                in_stock=True,
                stock_quantity=100
            ),
            Product(
                name="Hạt Cà Phê Robusta Đặc Biệt",
                description="Hạt cà phê Robusta đậm đà, vị đắng mạnh, hàm lượng caffeine cao, perfect cho espresso",
                price=200000,
                image_url="https://images.unsplash.com/photo-1461023058943-07fbeaa89384?w=400",
                category="Coffee Beans",
                in_stock=True,
                stock_quantity=80
            ),
            Product(
                name="Hạt Cà Phê Arabica Ethiopia",
                description="Hạt cà phê Arabica nhập khẩu từ Ethiopia, vị chua nhẹ, hương hoa quả đặc trưng",
                price=350000,
                image_url="https://images.unsplash.com/photo-1511920170033-f83969221c8f?w=400",
                category="Coffee Beans",
                in_stock=True,
                stock_quantity=50
            ),
            Product(
                name="Hạt Cà Phê Colombia Supremo",
                description="Hạt cà phê Colombia Supremo, vị cân bằng, hương caramel và chocolate đặc trưng",
                price=320000,
                image_url="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
                category="Coffee Beans",
                in_stock=True,
                stock_quantity=60
            ),
            Product(
                name="Hạt Cà Phê Brazil Santos",
                description="Hạt cà phê Brazil Santos, vị ngọt, hương nhẹ nhàng, perfect cho pha phin",
                price=280000,
                image_url="https://images.unsplash.com/photo-1511920170033-f83969221c8f?w=400",
                category="Coffee Beans",
                in_stock=True,
                stock_quantity=70
            ),
            Product(
                name="Hạt Cà Phê Liberica Độc Đáo",
                description="Hạt cà phê Liberica hiếm, vị độc đáo, hương khói đặc trưng, dành cho người sành điệu",
                price=400000,
                image_url="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
                category="Coffee Beans",
                in_stock=True,
                stock_quantity=30
            ),
            Product(
                name="Hạt Cà Phê Excelsa Premium",
                description="Hạt cà phê Excelsa với hương vị độc đáo, vị chua và đắng cân bằng, hương trái cây nhiệt đới",
                price=380000,
                image_url="https://images.unsplash.com/photo-1461023058943-07fbeaa89384?w=400",
                category="Coffee Beans",
                in_stock=True,
                stock_quantity=40
            ),
        ]
        
        for product in products:
            db.add(product)
        
        db.commit()
        print(f"✅ Đã thêm {len(products)} sản phẩm cà phê!")
        
    except Exception as e:
        print(f"❌ Lỗi khi seed data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_products()

