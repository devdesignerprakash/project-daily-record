import User from "../src/user/user.schema.js";

const seedAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
        if (!existingAdmin) {
            const admin = new User({
                fullName: 'Admin User',
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
                designation: 'Administrator',
                userType: 'admin'
            });
            await admin.save();
            console.log('Admin user created successfully.');
        }
    } catch (error) {
        console.error('Error occurred while seeding admin user:', error);
    }
};

export default seedAdmin;