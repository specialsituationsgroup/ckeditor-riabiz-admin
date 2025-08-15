/*
 * Admin Writing Interface
 * Copyright (C) 2024 RIABiz
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, see <https://www.gnu.org/licenses/>.
 */

type ErrorProps = {
    messages: string[],
}
const ErrorToast: React.FC<ErrorProps> = ({ messages }) => {
    return (
        <>
            <p><strong>Action required</strong></p>
            <ul className="list-disc list-inside">{messages.map((msg, idx) => <li key={idx}>{msg}</li>)}</ul>
        </>
    );
};

export default ErrorToast;