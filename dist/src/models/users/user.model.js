"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const database_2 = __importDefault(require("../../config/database"));
class UserModel {
    async createUser(u) {
        try {
            const connection = await database_1.default.connect();
            const requiredFields = ['email', 'phone_number', 'user_name'];
            const providedFields = Object.keys(u).filter((key) => u[key] !== undefined);
            if (!requiredFields.every((field) => providedFields.includes(field))) {
                throw new Error('Email, phone_number, and user_name are required fields.');
            }
            async function generateUserId() {
                try {
                    const currentYear = new Date().getFullYear().toString().slice(-2);
                    let nextId = 1;
                    const result = await database_2.default.query('SELECT MAX(CAST(SUBSTRING(id FROM 11 FOR 7) AS INTEGER)) AS max_id FROM users');
                    if (result.rows.length > 0) {
                        nextId = (result.rows[0].max_id || 0) + 1;
                    }
                    const nextIdFormatted = nextId.toString().padStart(7, '0');
                    const id = `Ahln_${currentYear}_U${nextIdFormatted}`;
                    return id;
                }
                catch (error) {
                    console.error('Error generating user_id:', error.message);
                    throw error;
                }
            }
            const id = await generateUserId();
            const createdAt = new Date();
            const updatedAt = new Date();
            const sqlFields = [
                'id',
                'user_name',
                'createdAt',
                'updatedAt',
                'is_active',
                'phone_number',
                'email',
                'password',
                'preferred_language',
                'role_id',
            ];
            const sqlParams = [
                id,
                u.user_name?.toLowerCase(),
                createdAt,
                updatedAt,
                u.is_active !== undefined ? u.is_active : true,
                u.phone_number,
                u.email?.toLowerCase(),
                u.password,
                u.preferred_language || null,
                2,
            ];
            const sql = `INSERT INTO users (${sqlFields.join(', ')}) 
              VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
              RETURNING id, user_name, role_id, createdAt, updatedAt, is_active, phone_number, email, preferred_language`;
            const result = await connection.query(sql, sqlParams);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Unable to create user: ${error.message}`);
        }
    }
    async getMany() {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT id, user_name, role_id, createdAt, updatedAt, is_active, phone_number, email, preferred_language FROM users';
            const result = await connection.query(sql);
            if (result.rows.length === 0) {
                throw new Error(`No users in the database`);
            }
            connection.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Error retrieving users: ${error.message}`);
        }
    }
    async getOne(id) {
        try {
            if (!id) {
                throw new Error('ID cannot be null. Please provide a valid user ID.');
            }
            const sql = `SELECT id, user_name, role_id, createdAt, updatedAt, is_active, phone_number, email, preferred_language FROM users 
                    WHERE id=$1`;
            const connection = await database_1.default.connect();
            const result = await connection.query(sql, [id]);
            if (result.rows.length === 0) {
                throw new Error(`Could not find user with ID ${id}`);
            }
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not find user ${id}: ${error.message}`);
        }
    }
    async updateUser(email, updateFields) {
        try {
            const user = await this.findByEmail(email);
            if (!user) {
                throw new Error(`User with email ${email} not found`);
            }
            return await this.updateOne(updateFields, user.id);
        }
        catch (error) {
            throw new Error(`Could not update user with email ${email}: ${error.message}`);
        }
    }
    async updateOne(u, id) {
        try {
            const connection = await database_1.default.connect();
            const queryParams = [];
            let paramIndex = 1;
            const updatedAt = new Date();
            const updateFields = Object.keys(u)
                .map((key) => {
                if (u[key] !== undefined &&
                    key !== 'id' &&
                    key !== 'createdAt') {
                    if (key === 'password') {
                        queryParams.push(bcrypt_1.default.hashSync(u.password + config_1.default.JWT_SECRET_KEY, 10));
                    }
                    else if (key === 'email') {
                        queryParams.push(u[key].toLowerCase());
                    }
                    else {
                        queryParams.push(u[key]);
                    }
                    return `${key}=$${paramIndex++}`;
                }
                return null;
            })
                .filter((field) => field !== null);
            queryParams.push(updatedAt);
            updateFields.push(`updatedAt=$${paramIndex++}`);
            queryParams.push(id);
            const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING id, user_name, role_id, createdAt, updatedAt, is_active, phone_number, email, preferred_language, email_verified`;
            const result = await connection.query(sql, queryParams);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not update user ${id}: ${error.message}`);
        }
    }
    async deleteOne(id) {
        try {
            const connection = await database_1.default.connect();
            if (!id) {
                throw new Error('ID cannot be null. Please provide a valid user ID.');
            }
            const sql = `DELETE FROM users WHERE id=$1 RETURNING id, user_name, role_id, createdAt, updatedAt, is_active, phone_number, email, preferred_language`;
            const result = await connection.query(sql, [id]);
            if (result.rows.length === 0) {
                throw new Error(`Could not find user with ID ${id}`);
            }
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not delete user ${id}: ${error.message}`);
        }
    }
    async findByEmail(email) {
        try {
            const connection = await database_1.default.connect();
            const sql = `SELECT * FROM users WHERE email=$1`;
            const result = await connection.query(sql, [email]);
            connection.release();
            if (result.rows.length) {
                return result.rows[0];
            }
            return null;
        }
        catch (error) {
            throw new Error(`Could not find user with email ${email}: ${error.message}`);
        }
    }
    async emailExists(email) {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT email FROM users WHERE email=$1';
            const result = await connection.query(sql, [email]);
            connection.release();
            return result.rows.length > 0;
        }
        catch (error) {
            throw new Error(`Unable to check email existence: ${error.message}`);
        }
    }
    async phoneExists(phone) {
        try {
            const sql = 'SELECT COUNT(*) FROM users WHERE phone_number = $1';
            const connection = await database_1.default.connect();
            const result = await connection.query(sql, [phone]);
            connection.release();
            return parseInt(result.rows[0].count) > 0;
        }
        catch (error) {
            console.error('Error checking phone existence:', error);
            throw new Error('Failed to check phone existence');
        }
    }
    async updateOtpHash(userId, otpHash, otpExpiration) {
        try {
            const connection = await database_1.default.connect();
            const sql = `UPDATE users SET otp_hash=$1, otp_expiration=$2 WHERE id=$3`;
            await connection.query(sql, [otpHash, otpExpiration, userId]);
            connection.release();
        }
        catch (error) {
            throw new Error(`Could not update OTP hash: ${error.message}`);
        }
    }
    async saveOtp(email, otp) {
        try {
            const connection = await database_1.default.connect();
            const sql = `UPDATE users SET register_otp=$1 WHERE email=$2`;
            await connection.query(sql, [otp, email]);
            connection.release();
        }
        catch (error) {
            throw new Error(`Could not save OTP for ${email}: ${error.message}`);
        }
    }
    async verifyOtp(email, otp) {
        try {
            const connection = await database_1.default.connect();
            const sql = `SELECT register_otp FROM users WHERE email=$1`;
            const result = await connection.query(sql, [email]);
            connection.release();
            if (result.rows.length && result.rows[0].register_otp === otp) {
                return true;
            }
            return false;
        }
        catch (error) {
            throw new Error(`Could not verify OTP for ${email}: ${error.message}`);
        }
    }
}
exports.default = UserModel;
//# sourceMappingURL=user.model.js.map