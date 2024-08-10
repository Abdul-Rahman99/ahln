"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
const database_2 = __importDefault(require("../../config/database"));
class UserModel {
    async createUser(u) {
        const connection = await database_1.default.connect();
        try {
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
                    throw new Error(error.message);
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
                'country',
                'city',
                'avatar',
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
                u.country || null,
                u.city || null,
                u.avatar || null,
            ];
            const sql = `INSERT INTO users (${sqlFields.join(', ')}) 
              VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
              RETURNING id, user_name, role_id, createdAt, updatedAt, is_active, phone_number, email, preferred_language, country, city, avatar`;
            const result = await connection.query(sql, sqlParams);
            return result.rows[0];
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async getMany() {
        const connection = await database_1.default.connect();
        try {
            const sql = 'SELECT id, user_name, role_id, is_active, phone_number, email, preferred_language FROM users';
            const result = await connection.query(sql);
            return result.rows;
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async getOne(id) {
        const connection = await database_1.default.connect();
        try {
            if (!id) {
                throw new Error('ID cannot be null. Please provide a valid user ID.');
            }
            const sql = `SELECT id, user_name, role_id, is_active, phone_number, email, preferred_language, country, city, avatar, password FROM users 
                    WHERE id=$1`;
            const result = await connection.query(sql, [id]);
            return result.rows[0];
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async updateOne(u, id) {
        const connection = await database_1.default.connect();
        try {
            const checkSql = 'SELECT id FROM users WHERE id=$1';
            const checkResult = await connection.query(checkSql, [id]);
            if (checkResult.rows.length === 0) {
                throw new Error(`User with ID ${id} does not exist`);
            }
            const queryParams = [];
            let paramIndex = 1;
            const updatedAt = new Date();
            const updateFields = Object.keys(u)
                .map((key) => {
                if (u[key] !== undefined &&
                    key !== 'id' &&
                    key !== 'createdAt') {
                    if (key === 'email' && u.email) {
                        queryParams.push(u.email.toLowerCase());
                    }
                    else {
                        queryParams.push(u[key]);
                        return `${key}=$${paramIndex++}`;
                    }
                }
                return null;
            })
                .filter((field) => field !== null);
            queryParams.push(updatedAt);
            updateFields.push(`updatedAt=$${paramIndex++}`);
            console.log(updateFields, "updateFields");
            queryParams.push(id);
            console.log(queryParams);
            const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING id, user_name, role_id, createdAt, updatedAt, is_active, phone_number, email, preferred_language, email_verified, country, city, avatar`;
            const result = await connection.query(sql, queryParams);
            result.rows[0].avatar = `${process.env.BASE_URL}/uploads/${result.rows[0].avatar}`;
            return result.rows[0];
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async deleteOne(id) {
        const connection = await database_1.default.connect();
        try {
            if (!id) {
                throw new Error('ID cannot be null. Please provide a valid user ID.');
            }
            if (id === 'Ahln_24_U0000001') {
                throw new Error("You Can't Delete The Admin User.");
            }
            const sql = `DELETE FROM users WHERE id=$1 RETURNING id, user_name, role_id, createdAt, updatedAt, is_active, phone_number, email, preferred_language, country, city, avatar`;
            const result = await connection.query(sql, [id]);
            return result.rows[0];
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async findByEmail(email) {
        const connection = await database_1.default.connect();
        try {
            const sql = `SELECT Role.title, users.* FROM users INNER JOIN Role ON users.role_id=Role.id WHERE users.email=$1`;
            const result = await connection.query(sql, [email]);
            if (result.rows.length) {
                return result.rows[0];
            }
            return null;
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
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
            throw new Error(error.message);
        }
    }
    async emailExists(email) {
        const connection = await database_1.default.connect();
        try {
            const sql = 'SELECT email FROM users WHERE email=$1';
            const result = await connection.query(sql, [email]);
            return result.rows.length > 0;
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async phoneExists(phone) {
        const connection = await database_1.default.connect();
        try {
            const sql = 'SELECT COUNT(*) FROM users WHERE phone_number = $1';
            const result = await connection.query(sql, [phone]);
            return parseInt(result.rows[0].count) > 0;
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async updateOtpHash(userId, otpHash, otpExpiration) {
        const connection = await database_1.default.connect();
        try {
            const sql = `UPDATE users SET otp_hash=$1, otp_expiration=$2 WHERE id=$3`;
            await connection.query(sql, [otpHash, otpExpiration, userId]);
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async saveOtp(email, otp) {
        const connection = await database_1.default.connect();
        try {
            const sql = `UPDATE users SET register_otp=$1 WHERE email=$2`;
            await connection.query(sql, [otp, email]);
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async verifyOtp(email, otp) {
        const connection = await database_1.default.connect();
        try {
            const sql = `SELECT register_otp FROM users WHERE email=$1`;
            const result = await connection.query(sql, [email]);
            if (result.rows.length && result.rows[0].register_otp === otp) {
                return true;
            }
            return false;
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async updateUserPassword(email, newPassword) {
        const connection = await database_1.default.connect();
        try {
            const sql = `UPDATE users SET password = $1 WHERE email = $2`;
            await connection.query(sql, [newPassword, email]);
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async checkResetPasswordOTP(email, otp) {
        const connection = await database_1.default.connect();
        try {
            const sql = `SELECT * FROM users WHERE email = $1 AND register_otp = $2`;
            const result = await connection.query(sql, [email, otp]);
            return result.rows.length > 0;
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async updateResetPasswordOTP(email, otp) {
        const connection = await database_1.default.connect();
        try {
            const sql = `UPDATE users SET register_otp = $1 WHERE email = $2`;
            await connection.query(sql, [otp, email]);
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async updateUserToken(userId, token) {
        const connection = await database_1.default.connect();
        try {
            const sql = `UPDATE users SET token = $1 WHERE id = $2`;
            await connection.query(sql, [token, userId]);
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async deleteUserToken(userId, token) {
        const connection = await database_1.default.connect();
        try {
            const sql = `UPDATE users SET token = null WHERE id = $2`;
            await connection.query(sql, [token, userId]);
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async findByToken(token) {
        const connection = await database_1.default.connect();
        try {
            const sql = 'SELECT id FROM users WHERE token=$1';
            const result = await connection.query(sql, [token]);
            if (result.rows.length) {
                return result.rows[0].id;
            }
            return null;
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async findUserByBoxId(boxId) {
        const connection = await database_1.default.connect();
        try {
            const userResult = await connection.query('SELECT User_Box.user_id FROM Box INNER JOIN User_Box ON Box.id = User_Box.box_id WHERE Box.id = $1', [boxId]);
            return userResult.rows[0].user_id;
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async findRoleIdByUserId(id) {
        const connection = await database_1.default.connect();
        try {
            const sql = 'SELECT role_id FROM users WHERE id=$1';
            const result = await connection.query(sql, [id]);
            if (result.rows.length) {
                return result.rows[0].role_id;
            }
            return 0;
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
}
exports.default = UserModel;
//# sourceMappingURL=user.model.js.map