# E-Commerce

This repository contains the source code for a E-commerce(store - dashboard) application. The application allows users to explore our products, see product details, create review on products, and seamlessly purchase products online with stripe and allows admins to manages store via dashboard by which they can see overview about store and manage billboards, categories, sizes, colors, products and orders.

## Key Features

- **Authentication**: Sign-up, Sign-in, email verfication, forget password.
- **Explore Products**: Discover our products and get all its details and all colors and sizes, filter products to get specific result, create reviews , add products to wishlist and more.
- **Cart**: Where user manage his orders to checkout or track paied orders.
- **Purchase products**: Checkout online anywhere anytime via stripe.
- **Responsive**: App can run on multiple devices with different aspect ratios.
- **Admin-Dashboard**: Manage store by create and update billboards, categories, sizes, colors, products and manage orders.

## Tech Stack

- **Back-end**: Node, Express, PostgreSQL, PrismaORM, Pug.js, JWT, Multer for robust back-end support.
- **Front-end**: React.js , Redux, Tailwind, Shadcn/ui for client-side.
- **Payment**: Managed online payment with stripe.
- **Email provider**: Integrated Brevo (SMTP) as email provider service .

## Getting Started

1. **Clone the repository**: `git clone https://github.com/AmrMustafa282/e-commerce-dev`
2. **Set up Environment**:Create .env and add
   DATABASE_URL
   port
   NODE_ENV
   JWT_SECRET
   JWT_EXPIRES_IN
   JWT_COOKIE_EXPIRES_IN
   BREVO_EMAIL_USERNAME
   BREVO_EMAIL_PASSWORD
   STRIPE_SECRET_KEY
   STRIPE_WEBHOOK_SECRET
   EMAIL_FROM .
3. **Build project**: `npm run build`
4. **Start the development server**: `npm run start`
5. **Open the application**: Visit `http://localhost:8000` in your browser.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- This project was inspired by [@Antonio Erdeljac](https://github.com/AntonioErdeljac) [Tutorial](https://www.youtube.com/watch?v=5miHyP6lExg&t=37486s) .
- Special thanks to the contributors and maintainers of the technologies used in this project.

Feel free to reach out with any questions or feedback!

![](/public/images/home.png)
![](/public/images/filter.png)
![](/public/images/product_details1.png)
![](/public/images/product_details2.png)
![](/public/images/cart.png)
![](/public/images/stripe.png)

![](/public/images/overview.png)
![](/public/images/billboards.png)
![](/public/images/categories.jpg)
![](/public/images/sizes.jpg)
![](/public/images/colors.jpg)
![](/public/images/products.jpg)
![](/public/images/orders.png)
![](/public/images/product_create.png)
![](/public/images/product_update.png)
