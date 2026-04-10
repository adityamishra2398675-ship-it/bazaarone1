import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Types "../types/products";
import CommonTypes "../types/common";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type Product = Types.Product;
  public type CreateProductInput = Types.CreateProductInput;
  public type UpdateProductInput = Types.UpdateProductInput;
  public type ProductFilter = Types.ProductFilter;
  public type ProductId = Types.ProductId;
  public type UserId = Types.UserId;

  public func getProduct(
    products : Map.Map<Nat, Product>,
    productId : ProductId,
  ) : ?Product {
    products.get(productId);
  };

  public func listProducts(
    products : Map.Map<Nat, Product>,
    filterOpts : ProductFilter,
  ) : [Product] {
    let all = List.fromIter<Product>(products.values());
    let result = all.filter(func(p : Product) : Bool {
      if (not p.isActive) return false;
      switch (filterOpts.category) {
        case (?cat) { if (p.category != cat) return false };
        case null {};
      };
      switch (filterOpts.minPrice) {
        case (?min) { if (p.price < min) return false };
        case null {};
      };
      switch (filterOpts.maxPrice) {
        case (?max) { if (p.price > max) return false };
        case null {};
      };
      switch (filterOpts.minRating) {
        case (?minR) { if (p.rating < minR) return false };
        case null {};
      };
      if (filterOpts.inStockOnly and p.stock == 0) return false;
      switch (filterOpts.keyword) {
        case (?kw) {
          let kwLower = kw.toLower();
          let titleMatch = p.title.toLower().contains(#text kwLower);
          let descMatch = p.description.toLower().contains(#text kwLower);
          if (not titleMatch and not descMatch) return false;
        };
        case null {};
      };
      true;
    });
    result.toArray();
  };

  public func listSellerProducts(
    products : Map.Map<Nat, Product>,
    sellerId : UserId,
  ) : [Product] {
    let result = List.fromIter<Product>(products.values()).filter(
      func(p : Product) : Bool { Principal.equal(p.sellerId, sellerId) }
    );
    result.toArray();
  };

  public func createProduct(
    products : Map.Map<Nat, Product>,
    sellerId : UserId,
    input : CreateProductInput,
    nextId : Nat,
  ) : Product {
    let now = Time.now();
    let product : Product = {
      id = nextId;
      title = input.title;
      description = input.description;
      price = input.price;
      currency = input.currency;
      category = input.category;
      images = input.images;
      rating = 0.0;
      stock = input.stock;
      sellerId = sellerId;
      deliveryEstimate = input.deliveryEstimate;
      isActive = true;
      createdAt = now;
      updatedAt = now;
    };
    products.add(nextId, product);
    product;
  };

  public func updateProduct(
    products : Map.Map<Nat, Product>,
    sellerId : UserId,
    input : UpdateProductInput,
  ) : Product {
    let existing = switch (products.get(input.id)) {
      case (?p) p;
      case null Runtime.trap("Product not found");
    };
    if (not Principal.equal(existing.sellerId, sellerId)) {
      Runtime.trap("Unauthorized: Not your product");
    };
    let updated : Product = {
      existing with
      title = input.title;
      description = input.description;
      price = input.price;
      currency = input.currency;
      category = input.category;
      images = input.images;
      stock = input.stock;
      deliveryEstimate = input.deliveryEstimate;
      isActive = input.isActive;
      updatedAt = Time.now();
    };
    products.add(input.id, updated);
    updated;
  };

  public func deleteProduct(
    products : Map.Map<Nat, Product>,
    sellerId : UserId,
    productId : ProductId,
  ) {
    let existing = switch (products.get(productId)) {
      case (?p) p;
      case null Runtime.trap("Product not found");
    };
    if (not Principal.equal(existing.sellerId, sellerId)) {
      Runtime.trap("Unauthorized: Not your product");
    };
    // Soft-delete: mark inactive
    products.add(productId, { existing with isActive = false; updatedAt = Time.now() });
  };

  public func decrementStock(
    products : Map.Map<Nat, Product>,
    productId : ProductId,
    quantity : Nat,
  ) {
    let existing = switch (products.get(productId)) {
      case (?p) p;
      case null Runtime.trap("Product not found");
    };
    if (existing.stock < quantity) {
      Runtime.trap("Insufficient stock for product: " # existing.title);
    };
    let newStock : Nat = existing.stock - quantity;
    products.add(productId, { existing with stock = newStock; updatedAt = Time.now() });
  };

  // Seed sample Indian products
  public func seedProducts(
    products : Map.Map<Nat, Product>,
    sellerPrincipal : Principal,
    startId : Nat,
  ) : Nat {
    let now = Time.now();
    let seedData : [(Text, Text, Nat, CommonTypes.Category, Text, Text)] = [
      // (title, description, price INR, category, delivery, currency)
      ("Samsung Galaxy M34 5G", "6.5\" Super AMOLED, 6000mAh battery, 128GB", 17999, #electronics, "2-3 days", "INR"),
      ("OnePlus Nord CE 3 Lite", "Snapdragon 695, 108MP camera, 5G phone", 19999, #electronics, "2-3 days", "INR"),
      ("boAt Airdopes 141", "TWS earbuds with 42Hr playtime, BT v5.0", 1299, #electronics, "3-5 days", "INR"),
      ("Lenovo IdeaPad Slim 3", "Intel Core i3, 8GB RAM, 512GB SSD laptop", 39999, #electronics, "5-7 days", "INR"),
      ("Mi 43\" Smart TV", "Full HD Android TV, Netflix, Prime Video", 27999, #electronics, "5-7 days", "INR"),
      ("Allen Solly Men's Formal Shirt", "100% Cotton, Regular Fit, Office Wear", 999, #clothes, "3-5 days", "INR"),
      ("W Women's Kurta Set", "Ethnic wear with dupatta, XS-3XL sizes", 1299, #clothes, "3-5 days", "INR"),
      ("Levis 511 Slim Jeans", "Stretch denim, slim fit, dark blue wash", 2499, #clothes, "3-5 days", "INR"),
      ("Bata Men's Formal Shoes", "Genuine leather, lace-up, black color", 1999, #clothes, "4-6 days", "INR"),
      ("Nike Dri-FIT T-Shirt", "Sports wear, moisture-wicking fabric, S-XXL", 1499, #clothes, "3-5 days", "INR"),
      ("Atomic Habits - James Clear", "Build good habits, break bad ones", 399, #books, "2-4 days", "INR"),
      ("Rich Dad Poor Dad - Robert Kiyosaki", "Personal finance and investment classic", 299, #books, "2-4 days", "INR"),
      ("Wings of Fire - APJ Abdul Kalam", "Autobiography of India's missile man", 199, #books, "2-4 days", "INR"),
      ("Class 10 NCERT Mathematics", "NCERT textbook for board exam preparation", 149, #books, "2-4 days", "INR"),
      ("The Psychology of Money", "Timeless lessons on wealth and greed", 449, #books, "2-4 days", "INR"),
      ("Aashirvaad Atta 10kg", "Whole wheat atta, superior quality grain", 349, #groceries, "Same day", "INR"),
      ("Amul Gold Full Cream Milk 1L", "Fresh pasteurised full cream milk", 68, #groceries, "Same day", "INR"),
      ("Tata Salt 1kg", "Vacuum evaporated iodized salt", 28, #groceries, "Same day", "INR"),
      ("Fortune Sunflower Oil 5L", "Refined sunflower oil, light and healthy", 699, #groceries, "Same day", "INR"),
      ("Maggi 2-Minute Noodles 12-pack", "Classic masala flavour, family pack", 156, #groceries, "Same day", "INR"),
      ("Colgate Strong Teeth Toothpaste 300g", "Calcium boost for strong teeth", 129, #essentials, "Same day", "INR"),
      ("Dettol Handwash 250ml", "Original antibacterial liquid soap", 89, #essentials, "Same day", "INR"),
      ("Surf Excel Matic Front Load 3kg", "Laundry detergent for washing machine", 599, #essentials, "2-3 days", "INR"),
    ];
    var id = startId;
    for ((title, desc, price, cat, delivery, currency) in seedData.vals()) {
      let product : Product = {
        id = id;
        title = title;
        description = desc;
        price = price;
        currency = currency;
        category = cat;
        images = [];
        rating = 4.0;
        stock = 100;
        sellerId = sellerPrincipal;
        deliveryEstimate = delivery;
        isActive = true;
        createdAt = now;
        updatedAt = now;
      };
      products.add(id, product);
      id += 1;
    };
    id; // return next available id
  };
};
